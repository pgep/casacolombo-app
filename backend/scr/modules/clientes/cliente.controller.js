const Cliente = require('../../../models/cliente.model');

const clienteController = {
  async listar(req, res) {
    try {
      const clientes = await Cliente.findAll(req.query.apenasAtivos !== 'false');
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const cliente = await Cliente.findById(req.params.id);
      if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST criar novo cliente
  async criar(req, res) {
    try {
      const cliente = await Cliente.create(req.body);
      res.status(201).json(cliente);
    } catch (error) {
      // Código 23505 é violação de chave única no PostgreSQL
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const cliente = await Cliente.update(req.params.id, req.body);
      if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const cliente = await Cliente.delete(req.params.id);
      if (!cliente) return res.status(404).json({ message: 'Cliente não encontrado' });
      res.json({ message: 'Cliente removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = clienteController;