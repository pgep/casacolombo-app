const db = require('../../config/database');

class TipoInsumo {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS tipos_insumo (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await db.query(query);
      console.log('✅ Tabela "tipos_insumo" verificada/criada');
    } catch (error) {
      console.error('❌ Erro ao criar tabela tipos_insumo:', error);
    }
  }

  // Buscar todos (apenas ativos por padrão)
  static async findAll(apenasAtivos = true) {
    let query = 'SELECT * FROM tipos_insumo';
    if (apenasAtivos) {
      query += ' WHERE ativo = true';
    }
    query += ' ORDER BY nome ASC';
    
    const result = await db.query(query);
    return result.rows;
  }

  // Buscar por ID
  static async findById(id) {
    const query = 'SELECT * FROM tipos_insumo WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Criar novo
  static async create(data) {
    const { nome, ativo = true } = data;
    const query = `
      INSERT INTO tipos_insumo (nome, ativo)
      VALUES ($1, $2)
      RETURNING *
    `;
    const result = await db.query(query, [nome, ativo]);
    return result.rows[0];
  }

  // Atualizar
  static async update(id, data) {
    const { nome, ativo } = data;
    const query = `
      UPDATE tipos_insumo 
      SET nome = $1, ativo = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
    const result = await db.query(query, [nome, ativo, id]);
    return result.rows[0];
  }

  // Deletar
  static async delete(id) {
    const query = 'DELETE FROM tipos_insumo WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = TipoInsumo;