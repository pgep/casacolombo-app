const UnidadeMedida = require('../../../models/unidadeMedida.model');

const unidadeMedidaController = {
  async listar(req, res) {
    try {
      const dados = await UnidadeMedida.findAll();
      res.json(dados);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const item = await UnidadeMedida.findById(req.params.id);

      if (!item) {
        return res.status(404).json({ message: 'Não encontrado' });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async criar(req, res) {
    try {
      const item = await UnidadeMedida.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const item = await UnidadeMedida.update(req.params.id, req.body);

      if (!item) {
        return res.status(404).json({ message: 'Não encontrado' });
      }

      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const item = await UnidadeMedida.delete(req.params.id);

      if (!item) {
        return res.status(404).json({ message: 'Não encontrado' });
      }

      res.json({ message: 'Removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = unidadeMedidaController;
