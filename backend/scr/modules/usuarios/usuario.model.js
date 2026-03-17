const db = require('../../config/database');
const bcrypt = require('bcrypt');

class Usuario {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        nivel VARCHAR(50) NOT NULL DEFAULT 'operador',
        ativo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await db.query(query);
      console.log('✅ Tabela "usuarios" verificada/criada');
    } catch (error) {
      console.error('❌ Erro ao criar tabela usuarios:', error);
    }
  }

  static async findAll() {
    const result = await db.query(
      'SELECT id, nome, email, nivel, ativo, created_at, updated_at FROM usuarios ORDER BY id DESC'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      'SELECT id, nome, email, nivel, ativo, created_at, updated_at FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create(data) {
    const { nome, email, senha, nivel, ativo = true } = data;
    
    // Hash da senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    
    const query = `
      INSERT INTO usuarios (nome, email, senha, nivel, ativo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, email, nivel, ativo, created_at, updated_at
    `;
    
    const result = await db.query(query, [nome, email, senhaHash, nivel, ativo]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { nome, email, senha, nivel, ativo } = data;
    
    // Construir query dinamicamente
    let query = 'UPDATE usuarios SET ';
    const values = [];
    let paramCount = 1;
    
    if (nome !== undefined) {
      query += `nome = $${paramCount}, `;
      values.push(nome);
      paramCount++;
    }
    
    if (email !== undefined) {
      query += `email = $${paramCount}, `;
      values.push(email);
      paramCount++;
    }
    
    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      query += `senha = $${paramCount}, `;
      values.push(senhaHash);
      paramCount++;
    }
    
    if (nivel !== undefined) {
      query += `nivel = $${paramCount}, `;
      values.push(nivel);
      paramCount++;
    }
    
    if (ativo !== undefined) {
      query += `ativo = $${paramCount}, `;
      values.push(ativo);
      paramCount++;
    }
    
    query += `updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING id, nome, email, nivel, ativo, created_at, updated_at`;
    values.push(id);
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  // Verificar se email já existe (para criação)
  static async emailExiste(email) {
    try {
      const result = await db.query(
        'SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1)',
        [email]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }

  // Verificar se email já existe, ignorando um ID específico (para edição)
  static async emailExisteComExcecao(email, idIgnorar) {
    try {
      const result = await db.query(
        'SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1) AND id != $2',
        [email, idIgnorar]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }

  // Verificar se nome já existe
  static async nomeExiste(nome) {
    try {
      const result = await db.query(
        'SELECT id FROM usuarios WHERE LOWER(nome) = LOWER($1)',
        [nome]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar nome:', error);
      throw error;
    }
  }

  // Verificar se nome já existe, ignorando um ID específico (para edição)
  static async nomeExisteComExcecao(nome, idIgnorar) {
    try {
      const result = await db.query(
        'SELECT id FROM usuarios WHERE LOWER(nome) = LOWER($1) AND id != $2',
        [nome, idIgnorar]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error('Erro ao verificar nome:', error);
      throw error;
    }
  }

}

module.exports = Usuario;