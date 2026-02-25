const db = require('../config/database');

class Cliente {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        telefone VARCHAR(20),
        ativo BOOLEAN DEFAULT true,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await db.query(query);
      console.log('✅ Tabela "clientes" verificada/criada');
    } catch (error) {
      console.error('❌ Erro ao criar tabela:', error);
    }
  }

  // Buscar todos (apenas ativos por padrão)
  static async findAll(apenasAtivos = true) {
    let query = 'SELECT * FROM clientes';
    if (apenasAtivos) {
      query += ' WHERE ativo = true';
    }
    query += ' ORDER BY id DESC';
    
    const result = await db.query(query);
    return result.rows;
  }

  // Buscar por ID
  static async findById(id) {
    const query = 'SELECT * FROM clientes WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Criar novo cliente
  static async create(data) {
    const { nome, email, telefone, ativo = true } = data;
    const query = `
      INSERT INTO clientes (nome, email, telefone, ativo)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [nome, email, telefone, ativo]);
    return result.rows[0];
  }

  // Atualizar cliente
  static async update(id, data) {
    const { nome, email, telefone, ativo } = data;
    const query = `
      UPDATE clientes 
      SET nome = $1, email = $2, telefone = $3, ativo = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(query, [nome, email, telefone, ativo, id]);
    return result.rows[0];
  }

  // Deletar (ou inativar) - vou manter DELETE físico por enquanto
  static async delete(id) {
    const query = 'DELETE FROM clientes WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // Buscar por email (útil para validação)
  static async findByEmail(email) {
    const query = 'SELECT * FROM clientes WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }
}

module.exports = Cliente;