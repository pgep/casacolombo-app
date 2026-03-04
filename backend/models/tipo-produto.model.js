const db = require('../scr/config/database');

class TipoProduto {

    static async initTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS tipoproduto (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        ativo BOOLEAN DEFAULT true,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      `;
      try {
        await db.query(query);
        console.log('✅ Tabela "tipoproduto" verificada/criada')
      }catch{
        console.log(' Erro ao criar tabela:',error);
      }
    }

    // buscar todos (spenas ativos por padrão)
    static async findAll(apenasAtivos = true){
        let query = 'Select * from tipoproduto';
        if(apenasAtivos){
            query += ' Where ativo = true';
        }
        query += ' ORDER by nome asc';
        const result = await db.query(query);
        return result.rows;
    }

    // Buscar por id
    static async findById(id){
        const query = 'select * from tipoproduto where id = $1';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    // Criar novo cliente
    static  async create(data){
        const {nome, ativo = true } = data;
        const query = `
        insert into tipoproduto (nome,ativo)
        values ($1,$2)
        returning *
        `;
        const result = await db.query(query, [nome,ativo]);
        return result.rows[0];
    }

    // Atualizar cliente
    static  async update(id,data){
        const {nome, ativo = true } = data;
        const query = `
        update tipoproduto set nome = $1, ativo = $2, updated_at = CURRENT_TIMESTAMP
        Where id = $3
        returning *
        `;
        const result = await db.query(query, [nome,ativo,id]);
        return result.rows[0];
    }

    // Deletar
    static async delete (id){
        const query = 'delete from tipoproduto where id = $1 returning id';
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

}

module.exports = TipoProduto;