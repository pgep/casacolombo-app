const Insumo = require('../../../models/insumo.model');

const controller = {
  async listar(req, res) {
    try {
      const data = await Insumo.findAll();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async buscarPorId(req, res) {
    const item = await Insumo.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Não encontrado' });
    res.json(item);
  },

  async criar(req, res) {
    const item = await Insumo.create(req.body);
    res.status(201).json(item);
  },

  async atualizar(req, res) {
    const item = await Insumo.update(req.params.id, req.body);
    res.json(item);
  },

  async deletar(req, res) {
    await Insumo.delete(req.params.id);
    res.json({ message: 'Removido' });
  },
};

module.exports = controller;
