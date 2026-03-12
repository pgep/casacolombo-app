const db = require('../../config/database');
const TipoProduto = require('../../../models/tipo-produto.model');

async function verificarNomeDuplicado(nome , idIgnorar = null) {
  let query = 'select id from tipoproduto where lower(nome) = lower($1)';
  const params = [nome];
  if(idIgnorar){
    query += ' and id != $2';
    params.push(idIgnorar);
  }
  const result = await db.query(query,params);
  return result.rows.length > 0;
}

const tipoprodutoController = {
  async listar(req, res) {
    try {
      const tipoprodutos = await TipoProduto.findAll(req.query.apenasAtivos !== 'false');
      res.json(tipoprodutos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const tipoproduto = await TipoProduto.findById(req.params.id);
      if (!tipoproduto) return res.status(404).json({ message: 'Tipo Produto não encontrado' });
      res.json(tipoproduto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

async criar(req, res) {
  try {
    
    const { nome, ativo } = req.body;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    
    const existe = await verificarNomeDuplicado(nome);
    
    if (existe) {
      return res.status(409).json({ 
        error: 'Já existe um Tipo Produto com esse nome!',
        campo: 'nome'
      });
    }

    const tipoproduto = await TipoProduto.create({ nome, ativo });
    res.status(201).json(tipoproduto);
    
  } catch (error) {
    console.error('Erro ao criar tipo:', error);
    res.status(500).json({ error: error.message });
  }
},

async atualizar(req, res) {
  try {
    const { nome, ativo } = req.body;
    const id = req.params.id;
    
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório!' });
    }
    
    const existe = await verificarNomeDuplicado(nome, id);
    
    if (existe) {
      return res.status(409).json({
        error: 'Já existe um Tipo Produto com esse nome!',
        campo: 'nome'
      });
    }

    const tipoproduto = await TipoProduto.update(id, { nome, ativo });
    
    if (!tipoproduto) {
      return res.status(404).json({ message: 'Tipo Produto não encontrado' });
    }
    
    res.json(tipoproduto);
    
  } catch (error) {
    console.error('❌ Erro ao atualizar tipo produto:', error);
    res.status(500).json({ error: error.message });
  }
},

  async deletar(req, res) {
    try {
      const tipoproduto = await TipoProduto.delete(req.params.id);
      if (!tipoproduto) return res.status(404).json({ message: 'Tipo Produto não encontrado' });
      res.json({ message: 'Tipo Produto removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = tipoprodutoController;