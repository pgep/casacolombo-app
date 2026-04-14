// backend/models/insumo.model.js

const db = require('../scr/config/database');

class Insumo {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS insumos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,

        unidade_medida_id INTEGER NOT NULL,
        quantidade_compra NUMERIC NOT NULL,
        valor_compra NUMERIC NOT NULL,

        quantidade_base NUMERIC NOT NULL,
        custo_unitario_base NUMERIC NOT NULL,

        quantidade_estoque NUMERIC NOT NULL DEFAULT 0,
        estoque_minimo NUMERIC DEFAULT 0,
        ativo BOOLEAN DEFAULT true,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (unidade_medida_id) REFERENCES unidades_medida(id)
      );
    `;

    await db.query(query);
    console.log('✅ Tabela "insumos" verificada/criada');
  }

  // MÉTODO ALTERADO - findAll (apenas ativos ou todos)
  static async findAll(mostrarInativos = false) {
    let query = `
    SELECT i.*, u.nome as unidade_nome, u.tipo, u.fator_conversao
    FROM insumos i
    JOIN unidades_medida u ON u.id = i.unidade_medida_id
  `;

    if (!mostrarInativos) {
      query += ` WHERE i.ativo = true`;
    }

    query += ` ORDER BY i.id DESC`;

    const result = await db.query(query);
    return result.rows;
  }

  // MÉTODO NOVO - Buscar todos (inclusive inativos)
  static async findAllWithInativos() {
    return this.findAll(true);
  }

  // MÉTODO ALTERADO - findById
  static async findById(id) {
    const result = await db.query('SELECT * FROM insumos WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const {
      nome,
      unidade_medida_id,
      quantidade_compra,
      valor_compra,
      estoque_minimo, // ✅ Adicionado
    } = data;

    // 🔥 BUSCA FATOR DE CONVERSÃO
    const unidade = await db.query(
      'SELECT fator_conversao, nome as unidade_nome FROM unidades_medida WHERE id = $1',
      [unidade_medida_id],
    );

    const fator = unidade.rows[0].fator_conversao;
    const unidade_nome = unidade.rows[0].unidade_nome;

    const quantidade_base = quantidade_compra * fator;
    const custo_unitario_base = valor_compra / quantidade_base;

    const result = await db.query(
      `
      INSERT INTO insumos (
        nome,
        unidade_medida_id,
        quantidade_compra,
        valor_compra,
        quantidade_base,
        custo_unitario_base,
        quantidade_estoque,
        estoque_minimo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        nome,
        unidade_medida_id,
        quantidade_compra,
        valor_compra,
        quantidade_base,
        custo_unitario_base,
        quantidade_base,
        estoque_minimo || 0, // ✅ Se não informado, padrão 0
      ],
    );

    const insumo = result.rows[0];
    insumo.unidade_nome = unidade_nome;
    insumo.fator_conversao = fator;

    return insumo;
  }

  static async update(id, data) {
    const {
      nome,
      unidade_medida_id,
      quantidade_compra,
      valor_compra,
      estoque_minimo, // ✅ Adicionado
    } = data;

    const unidade = await db.query(
      'SELECT fator_conversao FROM unidades_medida WHERE id = $1',
      [unidade_medida_id],
    );

    const fator = unidade.rows[0].fator_conversao;

    const quantidade_base = quantidade_compra * fator;
    const custo_unitario_base = valor_compra / quantidade_base;

    const result = await db.query(
      `
      UPDATE insumos
      SET nome=$1,
          unidade_medida_id=$2,
          quantidade_compra=$3,
          valor_compra=$4,
          quantidade_base=$5,
          custo_unitario_base=$6,
          quantidade_estoque=$7,
          estoque_minimo=$8,
          updated_at=CURRENT_TIMESTAMP
      WHERE id=$9
      RETURNING *
    `,
      [
        nome,
        unidade_medida_id,
        quantidade_compra,
        valor_compra,
        quantidade_base,
        custo_unitario_base,
        quantidade_base,
        estoque_minimo || 0,
        id,
      ],
    );

    return result.rows[0];
  }

  // MÉTODO ALTERADO - delete (agora decide entre excluir ou inativar)
  static async deleteOrInactivate(id) {
    // 1. Buscar o insumo
    const insumo = await db.query(
      'SELECT id, nome, quantidade_estoque, ativo FROM insumos WHERE id = $1',
      [id],
    );

    if (insumo.rows.length === 0) {
      throw new Error('Insumo não encontrado');
    }

    const insumoData = insumo.rows[0];
    const estoqueAtual = parseFloat(insumoData.quantidade_estoque);
    const nomeInsumo = insumoData.nome;

    // 2. Verificar se tem histórico (movimentações)
    const temHistorico = await db.query(
      `
    SELECT EXISTS (
      SELECT 1 FROM estoque_movimentacoes WHERE insumo_id = $1
      UNION ALL
      SELECT 1 FROM produtos_insumos WHERE insumo_id = $1
    ) as tem_historico
  `,
      [id],
    );

    const possuiHistorico = temHistorico.rows[0].tem_historico;

    // 3. Decidir ação baseada nas regras
    if (!possuiHistorico && estoqueAtual === 0) {
      // ✅ Caso 1: Sem histórico e estoque zerado → EXCLUIR FISICAMENTE
      await db.query('DELETE FROM insumos WHERE id = $1', [id]);
      return {
        acao: 'excluido',
        mensagem: `Insumo "${nomeInsumo}" foi excluído permanentemente.`,
      };
    } else if (!possuiHistorico && estoqueAtual > 0) {
      // ⚠️ Caso 2: Sem histórico mas com estoque → BLOQUEAR (exigir zerar)
      throw new Error(
        `Não é possível excluir "${nomeInsumo}". Estoque atual é ${estoqueAtual} unidades. ` +
          `Registre uma saída para zerar o estoque primeiro.`,
      );
    } else {
      // ✅ Caso 3: Com histórico → INATIVAR LOGICAMENTE
      await db.query(
        `
      UPDATE insumos 
      SET ativo = false, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1
    `,
        [id],
      );

      return {
        acao: 'inativado',
        mensagem: `Insumo "${nomeInsumo}" foi inativado. Ele permanece no histórico mas não pode mais ser utilizado em novas produções.`,
      };
    }
  }

  static async getEstoqueBaixo() {
    const result = await db.query(`
      SELECT * FROM insumos 
      WHERE quantidade_estoque <= estoque_minimo AND estoque_minimo > 0
    `);
    return result.rows;
  }

  // MÉTODO NOVO - Reativar insumo
  static async reativar(id) {
    const result = await db.query(
      `
    UPDATE insumos 
    SET ativo = true, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $1 AND ativo = false
    RETURNING *
  `,
      [id],
    );

    if (result.rows.length === 0) {
      throw new Error('Insumo não encontrado ou já está ativo');
    }

    return result.rows[0];
  }

  // MÉTODO NOVO - Verificar se pode ser excluído fisicamente
  static async podeExcluirFisicamente(id) {
    const result = await db.query(
      `
    SELECT 
      i.id,
      i.nome,
      i.quantidade_estoque,
      EXISTS (SELECT 1 FROM estoque_movimentacoes WHERE insumo_id = i.id) as tem_movimentacoes,
      EXISTS (SELECT 1 FROM produtos_insumos WHERE insumo_id = i.id) as tem_composicoes
    FROM insumos i
    WHERE i.id = $1
  `,
      [id],
    );

    if (result.rows.length === 0)
      return { pode: false, motivo: 'Insumo não encontrado' };

    const insumo = result.rows[0];

    if (insumo.tem_movimentacoes || insumo.tem_composicoes) {
      return {
        pode: false,
        motivo: 'Insumo possui histórico de movimentações ou composições',
        acao: 'inativar',
      };
    }

    if (insumo.quantidade_estoque > 0) {
      return {
        pode: false,
        motivo: `Estoque atual é ${insumo.quantidade_estoque} unidades`,
        acao: 'zerar_estoque',
      };
    }

    return { pode: true, motivo: null, acao: 'excluir' };
  }
}

module.exports = Insumo;
