const TipoProduto = require('../../../models/tipo-produto.model');

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
      const tipoproduto = await TipoProduto.create(req.body);
      res.status(201).json(tipoproduto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const tipoproduto = await TipoProduto.update(req.params.id, req.body);
      if (!tipoproduto) return res.status(404).json({ message: 'Tipo Produto não encontrado' });
      res.json(tipoproduto);
    } catch (error) {
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