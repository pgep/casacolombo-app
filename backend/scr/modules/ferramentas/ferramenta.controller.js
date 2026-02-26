const Ferramenta = require('./ferramenta.model');

const ferramentaController = {
  // GET /api/ferramentas
  async listar(req, res) {
    try {
      const ferramentas = await Ferramenta.findAll();
      res.json(ferramentas);
    } catch (error) {
      console.error('Erro ao listar ferramentas:', error);
      res.status(500).json({ error: 'Erro interno ao buscar ferramentas' });
    }
  },

  // GET /api/ferramentas/:id
  async buscarPorId(req, res) {
    try {
      const ferramenta = await Ferramenta.findById(req.params.id);
      if (!ferramenta) {
        return res.status(404).json({ message: 'Ferramenta não encontrada' });
      }
      res.json(ferramenta);
    } catch (error) {
      console.error('Erro ao buscar ferramenta:', error);
      res.status(500).json({ error: 'Erro interno ao buscar ferramenta' });
    }
  },

  // POST /api/ferramentas
  async criar(req, res) {
    try {
      const { nome, unidadeMedida, quantidadeEmEstoque } = req.body;
      
      // Validação básica
      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }

      const ferramenta = await Ferramenta.create({
        nome,
        unidadeMedida: unidadeMedida || '',
        quantidadeEmEstoque: quantidadeEmEstoque || 0
      });
      
      res.status(201).json(ferramenta);
    } catch (error) {
      console.error('Erro ao criar ferramenta:', error);
      res.status(500).json({ error: 'Erro interno ao criar ferramenta' });
    }
  },

  // PUT /api/ferramentas/:id
  async atualizar(req, res) {
    try {
      const { nome, unidadeMedida, quantidadeEmEstoque } = req.body;
      
      const ferramenta = await Ferramenta.update(req.params.id, {
        nome,
        unidadeMedida,
        quantidadeEmEstoque
      });
      
      if (!ferramenta) {
        return res.status(404).json({ message: 'Ferramenta não encontrada' });
      }
      
      res.json(ferramenta);
    } catch (error) {
      console.error('Erro ao atualizar ferramenta:', error);
      res.status(500).json({ error: 'Erro interno ao atualizar ferramenta' });
    }
  },

  // DELETE /api/ferramentas/:id
  async deletar(req, res) {
    try {
      const ferramenta = await Ferramenta.delete(req.params.id);
      
      if (!ferramenta) {
        return res.status(404).json({ message: 'Ferramenta não encontrada' });
      }
      
      res.json({ message: 'Ferramenta removida com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar ferramenta:', error);
      res.status(500).json({ error: 'Erro interno ao deletar ferramenta' });
    }
  }
};

module.exports = ferramentaController;