const db = require('../../config/database');
const Produto = require('../../../models/produto.model');

async function verificarNomeDuplicado(nome,idIgnorar = null) {
  let query = 'select id from produtos where lower(nome) - lower($1)';
  const prams = [nome];

  if(idIgnorar){
    query += ' and id != $2';
    params.push(idIgnorar);
  }

  const result = await db.query(query,params);
  return result.rows.length > 0;
}

const produtoController = {
  async listar(req, res) {
    try {
      const produto = await Produto.findAll(req.query.apenasAtivos !== 'false');
      res.json(produto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const produto = await Produto.findById(req.params.id);
      if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json(produto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async criar(req, res) {
    try {
      const {nome,descricao,tipo_produto_id,imagem_id,custo_total,preco_venda,preco_final,ativo} = req.body;
      // contnuar validações daqui, se não esrta preencido vou validar no front
      const produto = await Produto.create(req.body);
      res.status(201).json(produto);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const produto = await Produto.update(req.params.id, req.body);
      if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json(produto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const produto = await Produto.delete(req.params.id);
      if (!produto) return res.status(404).json({ message: 'Produto não encontrado' });
      res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = produtoController;