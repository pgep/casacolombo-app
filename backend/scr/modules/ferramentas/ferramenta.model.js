const db = require('../../config/database');

class Ferramenta {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS ferramentas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        unidadeMedida VARCHAR(50),
        quantidadeEmEstoque DECIMAL(10,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
    console.log('✅ Tabela ferramentas verificada');
  }

  static async findAll() {
    const result = await db.query('SELECT * FROM ferramentas ORDER BY id DESC');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM ferramentas WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const { nome, unidadeMedida, quantidadeEmEstoque } = data;
    const query = `
      INSERT INTO ferramentas (nome, unidadeMedida, quantidadeEmEstoque)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const result = await db.query(query, [nome, unidadeMedida, quantidadeEmEstoque]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { nome, unidadeMedida, quantidadeEmEstoque } = data;
    const query = `
      UPDATE ferramentas 
      SET nome=$1, unidadeMedida=$2, quantidadeEmEstoque=$3, updated_at=CURRENT_TIMESTAMP
      WHERE id=$4 RETURNING *
    `;
    const result = await db.query(query, [nome, unidadeMedida, quantidadeEmEstoque, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM ferramentas WHERE id=$1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = Ferramenta;