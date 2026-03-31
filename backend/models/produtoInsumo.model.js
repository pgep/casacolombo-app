const db = require('../scr/config/database');

class ProdutoInsumo {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS produtos_insumos (
        id SERIAL PRIMARY KEY,
        produto_id INTEGER REFERENCES produtos(id) ON DELETE CASCADE,
        insumo_id INTEGER REFERENCES insumos(id),
        quantidade DECIMAL(10,3) NOT NULL,
        custo_unitario DECIMAL(10,2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			    CONSTRAINT fk_produto FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
          CONSTRAINT fk_insumo FOREIGN KEY (insumo_id) REFERENCES insumos(id)
      );
    `;

    await db.query(query);
    console.log('✅ Tabela produtos_insumos OK');

    // Garantir que a coluna existe (se a tabela já existia)
    try {
      await db.query(`
        ALTER TABLE produtos_insumos 
        ADD COLUMN IF NOT EXISTS custo_unitario DECIMAL(10,2) NOT NULL DEFAULT 0
      `);
      console.log('✅ Coluna custo_unitario verificada/adicionada');
    } catch (error) {
      console.log(
        'Erro ao adicionar coluna (provavelmente já existe):',
        error.message,
      );
    }
  }

  static async getByProduto(produto_id) {
    const query = `
      SELECT pi.*, i.nome, i.unidade_medida_id
      FROM produtos_insumos pi
      JOIN insumos i ON i.id = pi.insumo_id
      WHERE pi.produto_id = $1
    `;
    const result = await db.query(query, [produto_id]);
    return result.rows;
  }

  static async deleteByProduto(produto_id) {
    await db.query('DELETE FROM produtos_insumos WHERE produto_id = $1', [
      produto_id,
    ]);
  }

  static async create(data) {
    const { produto_id, insumo_id, quantidade, custo_unitario } = data;

    const query = `
      INSERT INTO produtos_insumos (produto_id, insumo_id, quantidade, custo_unitario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;

    const result = await db.query(query, [
      produto_id,
      insumo_id,
      quantidade,
      custo_unitario,
    ]);
    return result.rows[0];
  }
}

module.exports = ProdutoInsumo;
