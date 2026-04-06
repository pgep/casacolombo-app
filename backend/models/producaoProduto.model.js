const db = require('../scr/config/database');

class ProducaoProduto {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS producao_produtos (
        id SERIAL PRIMARY KEY,
        produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
        quantidade_produzida INTEGER NOT NULL DEFAULT 0,
        quantidade_disponivel INTEGER NOT NULL DEFAULT 0,
        custo_total_producao DECIMAL(10,2) NOT NULL DEFAULT 0,
        custo_unitario_producao DECIMAL(10,2) NOT NULL DEFAULT 0,
        data_producao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        observacao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
    console.log('✅ Tabela "producao_produtos" verificada/criada');
  }

  static async findAll() {
    const result = await db.query(`
      SELECT pp.*, p.nome as produto_nome 
      FROM producao_produtos pp
      JOIN produtos p ON p.id = pp.produto_id
      ORDER BY pp.data_producao DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `
      SELECT pp.*, p.nome as produto_nome 
      FROM producao_produtos pp
      JOIN produtos p ON p.id = pp.produto_id
      WHERE pp.id = $1
    `,
      [id],
    );
    return result.rows[0];
  }

  static async create(data) {
    const { produto_id, quantidade_produzida, observacao } = data;

    // Buscar custo unitário do produto
    const produto = await db.query(
      'SELECT custo_total FROM produtos WHERE id = $1',
      [produto_id],
    );
    const custo_unitario = Number(produto.rows[0]?.custo_total) || 0;

    const custo_total_producao = custo_unitario * quantidade_produzida;
    const custo_unitario_producao = custo_total_producao / quantidade_produzida;

    const result = await db.query(
      `
      INSERT INTO producao_produtos 
        (produto_id, quantidade_produzida, quantidade_disponivel, 
         custo_total_producao, custo_unitario_producao, observacao)
      VALUES ($1, $2, $2, $3, $4, $5)
      RETURNING *
    `,
      [
        produto_id,
        quantidade_produzida,
        custo_total_producao,
        custo_unitario_producao,
        observacao,
      ],
    );

    return result.rows[0];
  }

  static async update(id, data) {
    const { quantidade_produzida, observacao } = data;

    const producao = await this.findById(id);
    if (!producao) return null;

    const produto = await db.query(
      'SELECT custo_total FROM produtos WHERE id = $1',
      [producao.produto_id],
    );
    const custo_unitario = Number(produto.rows[0]?.custo_total) || 0;

    const custo_total_producao = custo_unitario * quantidade_produzida;
    const custo_unitario_producao = custo_total_producao / quantidade_produzida;

    const result = await db.query(
      `
      UPDATE producao_produtos 
      SET quantidade_produzida = $1,
          quantidade_disponivel = $1,
          custo_total_producao = $2,
          custo_unitario_producao = $3,
          observacao = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `,
      [
        quantidade_produzida,
        custo_total_producao,
        custo_unitario_producao,
        observacao,
        id,
      ],
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM producao_produtos WHERE id = $1 RETURNING id',
      [id],
    );
    return result.rows[0];
  }
}

module.exports = ProducaoProduto;
