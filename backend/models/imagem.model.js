const db = require('../scr/config/database');

class Imagem {
  static async initTable() {
    // Cria tabela imagens
    await db.query(`
      CREATE TABLE IF NOT EXISTS imagens (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        imagem_base64 TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela "imagens" verificada/criada');
  }

  static async findAll() {
    const result = await db.query('SELECT * FROM imagens ORDER BY id DESC');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM imagens WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const { nome, imagem_base64 } = data;
    const result = await db.query(
      'INSERT INTO imagens (nome, imagem_base64) VALUES ($1, $2) RETURNING *',
      [nome, imagem_base64]
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { nome, imagem_base64 } = data;
    const result = await db.query(
      'UPDATE imagens SET nome = $1, imagem_base64 = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [nome, imagem_base64, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM imagens WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = Imagem;