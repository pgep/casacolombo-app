const ProducaoProduto = require('../../../models/producaoProduto.model');

const producaoProdutoController = {
  async listar(req, res) {
    try {
      const producoes = await ProducaoProduto.findAll();
      res.json(producoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const producao = await ProducaoProduto.findById(req.params.id);
      if (!producao)
        return res.status(404).json({ message: 'Produção não encontrada' });
      res.json(producao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async criar(req, res) {
    try {
      const producao = await ProducaoProduto.create(req.body);
      res.status(201).json(producao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const producao = await ProducaoProduto.update(req.params.id, req.body);
      if (!producao)
        return res.status(404).json({ message: 'Produção não encontrada' });
      res.json(producao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const producao = await ProducaoProduto.delete(req.params.id);
      if (!producao)
        return res.status(404).json({ message: 'Produção não encontrada' });
      res.json({ message: 'Produção removida com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = producaoProdutoController;
