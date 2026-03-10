const TipoInsumo = require('./tipo-insumo.model');

const tipoInsumoController = {
  // GET /api/tipos-insumo
  async listar(req, res) {
    try {
      const { apenasAtivos } = req.query;
      const tipos = await TipoInsumo.findAll(apenasAtivos !== 'false');
      res.json(tipos);
    } catch (error) {
      console.error('Erro ao listar tipos de insumo:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/tipos-insumo/:id
  async buscarPorId(req, res) {
    try {
      const tipo = await TipoInsumo.findById(req.params.id);
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de insumo não encontrado' });
      }
      res.json(tipo);
    } catch (error) {
      console.error('Erro ao buscar tipo de insumo:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/tipos-insumo
  async criar(req, res) {
    try {
      const { nome, ativo } = req.body;
      
      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const tipo = await TipoInsumo.create({ nome, ativo });
      res.status(201).json(tipo);
    } catch (error) {
      console.error('Erro ao criar tipo de insumo:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // PUT /api/tipos-insumo/:id
  async atualizar(req, res) {
    try {
      const { nome, ativo } = req.body;
      
      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const tipo = await TipoInsumo.update(req.params.id, { nome, ativo });
      
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de insumo não encontrado' });
      }
      
      res.json(tipo);
    } catch (error) {
      console.error('Erro ao atualizar tipo de insumo:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE /api/tipos-insumo/:id
  async deletar(req, res) {
    try {
      const tipo = await TipoInsumo.delete(req.params.id);
      
      if (!tipo) {
        return res.status(404).json({ message: 'Tipo de insumo não encontrado' });
      }
      
      res.json({ message: 'Tipo de insumo removido com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar tipo de insumo:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = tipoInsumoController;