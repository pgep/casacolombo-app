// backend/models/artesao.model.js
const db = require('../config/database');

class Artesao {
  // Criar tabela se não existir
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS artesaos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        especialidade VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await db.query(query);
      console.log('✅ Tabela "artesaos" verificada/criada');
    } catch (error) {
      console.error('❌ Erro ao criar tabela:', error);
    }
  }

  // Buscar todos
  static async findAll() {
    const result = await db.query('SELECT * FROM artesaos ORDER BY id DESC');
    return result.rows;
  }

  // Buscar por ID
  static async findById(id) {
    const result = await db.query('SELECT * FROM artesaos WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Criar novo
  static async create(data) {
    const { nome, email, telefone, especialidade } = data;
    const query = `
      INSERT INTO artesaos (nome, email, telefone, especialidade)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [nome, email, telefone, especialidade]);
    return result.rows[0];
  }

  // Atualizar
  static async update(id, data) {
    const { nome, email, telefone, especialidade } = data;
    const query = `
      UPDATE artesaos 
      SET nome = $1, email = $2, telefone = $3, especialidade = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(query, [nome, email, telefone, especialidade, id]);
    return result.rows[0];
  }

  // Deletar
  static async delete(id) {
    const query = 'DELETE FROM artesaos WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Artesao;