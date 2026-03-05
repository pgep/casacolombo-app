const db = require('../scr/config/database');

class Produto {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS produtos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        tipo_produto_id INTEGER REFERENCES tipoproduto(id),
        custo_total DECIMAL(10,2) DEFAULT 0,
        preco_venda DECIMAL(10,2) DEFAULT 0,
        preco_final DECIMAL(10,2) DEFAULT 0,
        imagem TEXT,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. 🗑️ REMOVER campo imagem (se existir)
    try {
      await db.query(`
        ALTER TABLE produtos 
        DROP COLUMN IF EXISTS imagem
      `);
      console.log('✅ Campo "imagem" removido (se existia)');
    } catch (error) {
      console.log('Campo imagem não existia ou já foi removido');
    }
    
    // 3. ➕ ADICIONAR campo imagem_id (se não existir)
    try {
      await db.query(`
        ALTER TABLE produtos 
        ADD COLUMN IF NOT EXISTS imagem_id INTEGER
      `);
      console.log('✅ Campo "imagem_id" adicionado/verificado');
    } catch (error) {
      console.log('Erro ao adicionar imagem_id:', error.message);
    }
    
    // 4. 🔗 ADICIONAR FK (se não existir)
    try {
      await db.query(`
        ALTER TABLE produtos 
        ADD CONSTRAINT fk_produto_imagem 
        FOREIGN KEY (imagem_id) 
        REFERENCES imagens(id)
        ON DELETE SET NULL
      `);
      console.log('✅ FK produto_imagem adicionada/verificada');
    } catch (error) {
      console.log('FK já existe:', error.message);
    }

    try {
      await db.query(query);
      console.log('✅ Tabela "produtos" verificada/criada');
    } catch (error) {
      console.error('❌ Erro ao criar tabela produtos:', error);
    }
  }

  static async findAll(apenasAtivos = true) {
    let query = `
      SELECT p.*, 
            tp.nome as tipo_nome,
            i.nome as imagem_nome,
            i.imagem_base64
      FROM produtos p
      LEFT JOIN tipoproduto tp ON p.tipo_produto_id = tp.id
      LEFT JOIN imagens i ON p.imagem_id = i.id
    `;
    
    if (apenasAtivos) {
      query += ' WHERE p.ativo = true';
    }
    
    query += ' ORDER BY p.id DESC';
    
    const result = await db.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT p.*, 
            tp.nome as tipo_nome,
            i.nome as imagem_nome,
            i.imagem_base64
      FROM produtos p
      LEFT JOIN tipoproduto tp ON p.tipo_produto_id = tp.id
      LEFT JOIN imagens i ON p.imagem_id = i.id
      WHERE p.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Criar novo
  static async create(data) {
    const { 
      nome, descricao, tipo_produto_id, 
      custo_total, preco_venda, preco_final, 
      imagem, ativo = true 
    } = data;
    
    const query = `
      INSERT INTO produtos 
        (nome, descricao, tipo_produto_id, custo_total, preco_venda, preco_final, imagem, ativo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nome, descricao, tipo_produto_id, 
      custo_total || 0, preco_venda || 0, preco_final || preco_venda || 0, 
      imagem, ativo
    ]);
    
    return result.rows[0];
  }

  // Atualizar
  static async update(id, data) {
    const { 
      nome, descricao, tipo_produto_id, 
      custo_total, preco_venda, preco_final, 
      imagem, ativo 
    } = data;
    
    const query = `
      UPDATE produtos 
      SET nome = $1, descricao = $2, tipo_produto_id = $3, 
          custo_total = $4, preco_venda = $5, preco_final = $6, 
          imagem = $7, ativo = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    
    const result = await db.query(query, [
      nome, descricao, tipo_produto_id, 
      custo_total, preco_venda, preco_final, 
      imagem, ativo, id
    ]);
    
    return result.rows[0];
  }

  // Deletar
  static async delete(id) {
    const query = 'DELETE FROM produtos WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Produto;