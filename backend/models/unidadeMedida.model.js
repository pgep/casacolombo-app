const db = require('../scr/config/database');

class UnidadeMedida {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS unidades_medida (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(50) NOT NULL,
        tipo VARCHAR(20) NOT NULL,
        fator_conversao NUMERIC NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await db.query(query);
      console.log('✅ Tabela "unidades_medida" verificada/criada');
    } catch (error) {
      console.error('❌ Erro ao criar tabela:', error);
    }
  }

  static async findAll() {
    const result = await db.query(
      'SELECT * FROM unidades_medida ORDER BY id DESC',
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT * FROM unidades_medida WHERE id = $1',
      [id],
    );
    return result.rows[0];
  }

  static async create(data) {
    const { nome, tipo, fator_conversao } = data;

    const query = `
      INSERT INTO unidades_medida (nome, tipo, fator_conversao)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await db.query(query, [nome, tipo, fator_conversao]);

    return result.rows[0];
  }

  static async update(id, data) {
    const { nome, tipo, fator_conversao } = data;

    const query = `
      UPDATE unidades_medida
      SET nome = $1,
          tipo = $2,
          fator_conversao = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;

    const result = await db.query(query, [nome, tipo, fator_conversao, id]);

    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM unidades_medida WHERE id = $1 RETURNING id',
      [id],
    );
    return result.rows[0];
  }
}

module.exports = UnidadeMedida;
