const pool = require('../../config/database');

class Essencia {
    static async initTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS essencias (
                id SERIAL PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                ativo BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        try {
            await pool.query(query);
            console.log('Tabela essencias verificada/criada com sucesso');
        } catch (error) {
            console.error('Erro ao criar tabela essencias:', error);
            throw error;
        }
    } //   insumo_id INTEGER REFERENCES insumos(id) ON DELETE SET NULL,  (Adicionar esta linha após criar insumo)

    // INSERT INTO essencias (nome, tipo, insumo_id)
    //         VALUES ($1, $2, $3)
    //         RETURNING *

    static async create(essenciaData) {
        const { nome, ativo } = essenciaData;
        const query = `
            INSERT INTO essencias (nome, ativo)
            VALUES ($1, $2)
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [nome, ativo]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    // SELECT e.*, i.nome as insumo_nome 
    //         FROM essencias e
    //         LEFT JOIN insumos i ON e.insumo_id = i.id
    //         ORDER BY e.nome

    static async findAll() {
        const query = `
            SELECT e.* 
            FROM essencias e            
            ORDER BY e.nome
        `;
        
        try {
            const result = await pool.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // SELECT e.*, i.nome as insumo_nome 
    //         FROM essencias e
    //         LEFT JOIN insumos i ON e.insumo_id = i.id
    //         WHERE e.id = $1

    static async findById(id) {
        const query = `
            SELECT e.* 
            FROM essencias e            
            WHERE e.id = $1
        `;
        
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async update(id, essenciaData) {
        const { nome, ativo } = essenciaData;
        const query = `
            UPDATE essencias 
            SET nome = $1, ativo = $2, updated_at = CURRENT_TIMESTAMP
            WHERE id = $3
            RETURNING *
        `;
        
        try {
            const result = await pool.query(query, [nome, ativo, id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async delete(id) {
        const query = 'DELETE FROM essencias WHERE id = $1 RETURNING id';
        
        try {
            const result = await pool.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Essencia;