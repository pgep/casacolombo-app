const db = require('../scr/config/database');

class Configuracao {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS configuracoes (
        id SERIAL PRIMARY KEY,
        chave VARCHAR(100) UNIQUE NOT NULL,
        valor VARCHAR(100) NOT NULL,
        descricao VARCHAR(255),
        ativo BOOLEAN DEFAULT true,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    try {
      await db.query(query);
      console.log('✅ Tabela "configuracoes" verificada/criada');
    } catch (error) {
      console.error('❌ Erro ao criar tabela:', error);
    }
  }

  // 🔍 Buscar todas (ativas por padrão)
  static async findAll(apenasAtivos = true) {
    let query = 'SELECT * FROM configuracoes';

    if (apenasAtivos) {
      query += ' WHERE ativo = true';
    }

    query += ' ORDER BY chave ASC';

    const result = await db.query(query);
    return result.rows;
  }

  // 🔍 Buscar por ID
  static async findById(id) {
    const query = 'SELECT * FROM configuracoes WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  // 🔍 Buscar por chave (ESSENCIAL para margem)
  static async findByChave(chave) {
    const query = 'SELECT * FROM configuracoes WHERE chave = $1';
    const result = await db.query(query, [chave]);
    return result.rows[0];
  }

  // ➕ Criar nova configuração
  static async create(data) {
    const { chave, valor, descricao, ativo = true } = data;

    const query = `
      INSERT INTO configuracoes (chave, valor, descricao, ativo)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await db.query(query, [chave, valor, descricao, ativo]);
    return result.rows[0];
  }

  // ✏️ Atualizar
  static async update(id, data) {
    const { chave, valor, descricao, ativo } = data;

    const query = `
      UPDATE configuracoes
      SET chave = $1,
          valor = $2,
          descricao = $3,
          ativo = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;

    const result = await db.query(query, [chave, valor, descricao, ativo, id]);
    return result.rows[0];
  }

  // ❌ Deletar (físico, igual seu padrão atual)
  static async delete(id) {
    const query = 'DELETE FROM configuracoes WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Configuracao;
