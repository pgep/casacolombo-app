// backend/models/insumo.model.js

const db = require('../scr/config/database');

class Insumo {
  static async initTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS insumos (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,

        unidade_medida_id INTEGER NOT NULL,
        quantidade_compra NUMERIC NOT NULL,
        valor_compra NUMERIC NOT NULL,

        quantidade_base NUMERIC NOT NULL,
        custo_unitario_base NUMERIC NOT NULL,

        quantidade_estoque NUMERIC NOT NULL DEFAULT 0,
        estoque_minimo NUMERIC DEFAULT 0,
        ativo BOOLEAN DEFAULT true,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (unidade_medida_id) REFERENCES unidades_medida(id)
      );
    `;

    await db.query(query);
    console.log('✅ Tabela "insumos" verificada/criada');
  }

  static async findAll() {
    const result = await db.query(`
      SELECT i.*, u.nome as unidade_nome, u.tipo, u.fator_conversao
      FROM insumos i
      JOIN unidades_medida u ON u.id = i.unidade_medida_id
      ORDER BY i.id DESC
    `);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query(
      `
      SELECT i.*, u.nome as unidade_nome, u.tipo, u.fator_conversao
      FROM insumos i
      JOIN unidades_medida u ON u.id = i.unidade_medida_id
      WHERE i.id = $1
    `,
      [id],
    );
    return result.rows[0];
  }

  static async create(data) {
    const {
      nome,
      unidade_medida_id,
      quantidade_compra,
      valor_compra,
      estoque_minimo, // ✅ Adicionado
    } = data;

    // 🔥 BUSCA FATOR DE CONVERSÃO
    const unidade = await db.query(
      'SELECT fator_conversao, nome as unidade_nome FROM unidades_medida WHERE id = $1',
      [unidade_medida_id],
    );

    const fator = unidade.rows[0].fator_conversao;
    const unidade_nome = unidade.rows[0].unidade_nome;

    const quantidade_base = quantidade_compra * fator;
    const custo_unitario_base = valor_compra / quantidade_base;

    const result = await db.query(
      `
      INSERT INTO insumos (
        nome,
        unidade_medida_id,
        quantidade_compra,
        valor_compra,
        quantidade_base,
        custo_unitario_base,
        quantidade_estoque,
        estoque_minimo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `,
      [
        nome,
        unidade_medida_id,
        quantidade_compra,
        valor_compra,
        quantidade_base,
        custo_unitario_base,
        quantidade_base,
        estoque_minimo || 0, // ✅ Se não informado, padrão 0
      ],
    );

    const insumo = result.rows[0];
    insumo.unidade_nome = unidade_nome;
    insumo.fator_conversao = fator;

    return insumo;
  }

  static async update(id, data) {
    const {
      nome,
      unidade_medida_id,
      quantidade_compra,
      valor_compra,
      estoque_minimo, // ✅ Adicionado
    } = data;

    const unidade = await db.query(
      'SELECT fator_conversao FROM unidades_medida WHERE id = $1',
      [unidade_medida_id],
    );

    const fator = unidade.rows[0].fator_conversao;

    const quantidade_base = quantidade_compra * fator;
    const custo_unitario_base = valor_compra / quantidade_base;

    const result = await db.query(
      `
      UPDATE insumos
      SET nome=$1,
          unidade_medida_id=$2,
          quantidade_compra=$3,
          valor_compra=$4,
          quantidade_base=$5,
          custo_unitario_base=$6,
          quantidade_estoque=$7,
          estoque_minimo=$8,
          updated_at=CURRENT_TIMESTAMP
      WHERE id=$9
      RETURNING *
    `,
      [
        nome,
        unidade_medida_id,
        quantidade_compra,
        valor_compra,
        quantidade_base,
        custo_unitario_base,
        quantidade_base,
        estoque_minimo || 0,
        id,
      ],
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM insumos WHERE id = $1 RETURNING id',
      [id],
    );
    return result.rows[0];
  }

  static async getEstoqueBaixo() {
    const result = await db.query(`
      SELECT * FROM insumos 
      WHERE quantidade_estoque <= estoque_minimo AND estoque_minimo > 0
    `);
    return result.rows;
  }
}

module.exports = Insumo;
