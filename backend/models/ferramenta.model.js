const db = require('../config/database');

class Ferramenta {
  // Método para criar a tabela
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
    
    try {
      await db.query(query);
      console.log('✅ Tabela "ferramentas" verificada/criada');
    } catch (error) {
      console.error('❌ Erro ao criar tabela ferramentas:', error);
    }
  }

  // Buscar todas
  static async findAll() {
    const result = await db.query('SELECT * FROM ferramentas ORDER BY id DESC');
    return result.rows;
  }

  // Buscar por ID
  static async findById(id) {
    const result = await db.query('SELECT * FROM ferramentas WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Criar nova
  static async create(data) {
    const { nome, unidadeMedida, quantidadeEmEstoque } = data;
    const query = `
      INSERT INTO ferramentas (nome, unidadeMedida, quantidadeEmEstoque)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await db.query(query, [nome, unidadeMedida, quantidadeEmEstoque || 0]);
    return result.rows[0];
  }

  // Atualizar
  static async update(id, data) {
    const { nome, unidadeMedida, quantidadeEmEstoque } = data;
    const query = `
      UPDATE ferramentas 
      SET nome = $1, unidadeMedida = $2, quantidadeEmEstoque = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `;
    const result = await db.query(query, [nome, unidadeMedida, quantidadeEmEstoque, id]);
    return result.rows[0];
  }

  // Deletar
  static async delete(id) {
    const query = 'DELETE FROM ferramentas WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

// ✅ VERIFIQUE SE ESTA LINHA EXISTE:
module.exports = Ferramenta;