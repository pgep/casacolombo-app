// backend/models/estoqueMovimentacao.model.js

const db = require('../scr/config/database');

const EstoqueMovimentacao = {
  // ✅ Inicializar tabela (criar se não existir)
  async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
        id SERIAL PRIMARY KEY,
        insumo_id INTEGER NOT NULL REFERENCES insumos(id) ON DELETE CASCADE,
        tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ajuste')),
        quantidade DECIMAL(10,3) NOT NULL,
        quantidade_antes DECIMAL(10,3) NOT NULL,
        quantidade_depois DECIMAL(10,3) NOT NULL,
        motivo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_insumo_id 
        ON estoque_movimentacoes(insumo_id);
      CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_created_at 
        ON estoque_movimentacoes(created_at);
      CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_tipo 
        ON estoque_movimentacoes(tipo);
    `;

    try {
      await db.query(query);
      console.log(
        '✅ Tabela estoque_movimentacoes verificada/criada com sucesso',
      );

      // Verificar se a coluna unidade_medida_sigla existe na view de insumos
      await this.ensureColumns();
    } catch (error) {
      console.error('❌ Erro ao criar tabela estoque_movimentacoes:', error);
      throw error;
    }
  },

  // ✅ Garantir que as colunas necessárias existem
  async ensureColumns() {
    try {
      // Verificar se a coluna estoque_minimo existe na tabela insumos
      const checkMinimo = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'insumos' AND column_name = 'estoque_minimo'
      `);

      if (checkMinimo.rows.length === 0) {
        await db.query(`
          ALTER TABLE insumos 
          ADD COLUMN estoque_minimo DECIMAL(10,3) DEFAULT 0
        `);
        console.log('✅ Coluna estoque_minimo adicionada à tabela insumos');
      }

      // Verificar se a coluna estoque_atual existe na tabela insumos
      const checkAtual = await db.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'insumos' AND column_name = 'estoque_atual'
      `);

      if (checkAtual.rows.length === 0) {
        await db.query(`
          ALTER TABLE insumos 
          ADD COLUMN estoque_atual DECIMAL(10,3) DEFAULT 0
        `);
        console.log('✅ Coluna estoque_atual adicionada à tabela insumos');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar colunas:', error);
    }
  },

  // ✅ CORRIGIR método listarInsumosComEstoque
  async listarInsumosComEstoque() {
    const query = `
    SELECT 
      i.id, 
      i.nome, 
      COALESCE(i.quantidade_estoque, 0) as estoque_atual,
      COALESCE(i.estoque_minimo, 0) as estoque_minimo,
      COALESCE(um.nome, 'un') as unidade_medida_sigla
    FROM insumos i
    LEFT JOIN unidades_medida um ON i.unidade_medida_id = um.id
    ORDER BY i.nome
  `;
    const result = await db.query(query);
    return result.rows;
  },

  // ✅ CORRIGIR método alertasEstoqueBaixo
  async alertasEstoqueBaixo() {
    const query = `
    SELECT 
      i.id, 
      i.nome, 
      COALESCE(i.quantidade_estoque, 0) as estoque_atual,
      COALESCE(i.estoque_minimo, 0) as estoque_minimo,
      COALESCE(um.nome, 'un') as unidade_medida_sigla
    FROM insumos i
    LEFT JOIN unidades_medida um ON i.unidade_medida_id = um.id
    WHERE COALESCE(i.quantidade_estoque, 0) <= COALESCE(i.estoque_minimo, 0)
      AND COALESCE(i.estoque_minimo, 0) > 0
    ORDER BY (COALESCE(i.quantidade_estoque, 0) / NULLIF(COALESCE(i.estoque_minimo, 0), 0)) ASC
  `;
    const result = await db.query(query);
    return result.rows;
  },

  // ✅ Buscar movimentações por insumo
  async findByInsumo(insumoId) {
    const query = `
      SELECT 
        em.*,
        i.nome as insumo_nome
      FROM estoque_movimentacoes em
      JOIN insumos i ON em.insumo_id = i.id
      WHERE em.insumo_id = $1
      ORDER BY em.created_at DESC
    `;
    const result = await db.query(query, [insumoId]);
    return result.rows;
  },

  // ✅ Buscar movimentação por ID
  async findById(id) {
    const query = `
      SELECT 
        em.*,
        i.nome as insumo_nome
      FROM estoque_movimentacoes em
      JOIN insumos i ON em.insumo_id = i.id
      WHERE em.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  // ✅ Listar todas movimentações
  async findAll() {
    const query = `
      SELECT 
        em.*,
        i.nome as insumo_nome
      FROM estoque_movimentacoes em
      JOIN insumos i ON em.insumo_id = i.id
      ORDER BY em.created_at DESC
    `;
    const result = await db.query(query);
    return result.rows;
  },

  // ✅ Registrar entrada
  async registrarEntrada(insumo_id, quantidade, motivo) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Buscar estoque atual
      const estoqueAtual = await client.query(
        'SELECT COALESCE(estoque_atual, 0) as estoque_atual FROM insumos WHERE id = $1',
        [insumo_id],
      );

      const quantidadeAntes = parseFloat(estoqueAtual.rows[0].estoque_atual);
      const quantidadeDepois = quantidadeAntes + quantidade;

      // Registrar movimentação
      const movimentacao = await client.query(
        `INSERT INTO estoque_movimentacoes 
         (insumo_id, tipo, quantidade, quantidade_antes, quantidade_depois, motivo) 
         VALUES ($1, 'entrada', $2, $3, $4, $5) 
         RETURNING *`,
        [
          insumo_id,
          quantidade,
          quantidadeAntes,
          quantidadeDepois,
          motivo || 'Entrada registrada',
        ],
      );

      // Atualizar estoque do insumo
      await client.query(
        'UPDATE insumos SET estoque_atual = $1 WHERE id = $2',
        [quantidadeDepois, insumo_id],
      );

      await client.query('COMMIT');
      return movimentacao.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // ✅ Registrar saída
  async registrarSaida(insumo_id, quantidade, motivo) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Buscar estoque atual
      const estoqueAtual = await client.query(
        'SELECT COALESCE(estoque_atual, 0) as estoque_atual FROM insumos WHERE id = $1',
        [insumo_id],
      );

      const quantidadeAntes = parseFloat(estoqueAtual.rows[0].estoque_atual);

      if (quantidadeAntes < quantidade) {
        throw new Error(
          `Estoque insuficiente. Disponível: ${quantidadeAntes}, Solicitado: ${quantidade}`,
        );
      }

      const quantidadeDepois = quantidadeAntes - quantidade;

      // Registrar movimentação
      const movimentacao = await client.query(
        `INSERT INTO estoque_movimentacoes 
         (insumo_id, tipo, quantidade, quantidade_antes, quantidade_depois, motivo) 
         VALUES ($1, 'saida', $2, $3, $4, $5) 
         RETURNING *`,
        [
          insumo_id,
          quantidade,
          quantidadeAntes,
          quantidadeDepois,
          motivo || 'Saída registrada',
        ],
      );

      // Atualizar estoque do insumo
      await client.query(
        'UPDATE insumos SET estoque_atual = $1 WHERE id = $2',
        [quantidadeDepois, insumo_id],
      );

      await client.query('COMMIT');
      return movimentacao.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // ✅ Registrar ajuste
  async registrarAjuste(insumo_id, quantidade, motivo, tipo) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      // Buscar estoque atual
      const estoqueAtual = await client.query(
        'SELECT COALESCE(estoque_atual, 0) as estoque_atual FROM insumos WHERE id = $1',
        [insumo_id],
      );

      const quantidadeAntes = parseFloat(estoqueAtual.rows[0].estoque_atual);
      const quantidadeDepois =
        tipo === 'entrada'
          ? quantidadeAntes + quantidade
          : quantidadeAntes - quantidade;

      // Registrar movimentação
      const movimentacao = await client.query(
        `INSERT INTO estoque_movimentacoes 
         (insumo_id, tipo, quantidade, quantidade_antes, quantidade_depois, motivo) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [
          insumo_id,
          tipo,
          quantidade,
          quantidadeAntes,
          quantidadeDepois,
          motivo || 'Ajuste manual',
        ],
      );

      // Atualizar estoque do insumo
      await client.query(
        'UPDATE insumos SET estoque_atual = $1 WHERE id = $2',
        [quantidadeDepois, insumo_id],
      );

      await client.query('COMMIT');
      return movimentacao.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  // ✅ Deletar movimentação
  async delete(id) {
    const query = 'DELETE FROM estoque_movimentacoes WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },
};

module.exports = EstoqueMovimentacao;
