const Configuracao = require('../../../models/configuracao.model');

const configuracaoController = {
  async listar(req, res) {
    try {
      const configuracoes = await Configuracao.findAll(
        req.query.apenasAtivos !== 'false',
      );
      res.json(configuracoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const configuracao = await Configuracao.findById(req.params.id);

      if (!configuracao)
        return res.status(404).json({ message: 'Configuração não encontrada' });

      res.json(configuracao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorChave(req, res) {
    try {
      const configuracao = await Configuracao.findByChave(req.params.chave);

      if (!configuracao)
        return res.status(404).json({ message: 'Configuração não encontrada' });

      res.json(configuracao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async criar(req, res) {
    try {
      const configuracao = await Configuracao.create(req.body);
      res.status(201).json(configuracao);
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Chave já cadastrada' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const configuracao = await Configuracao.update(req.params.id, req.body);

      if (!configuracao)
        return res.status(404).json({ message: 'Configuração não encontrada' });

      res.json(configuracao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const configuracao = await Configuracao.delete(req.params.id);

      if (!configuracao)
        return res.status(404).json({ message: 'Configuração não encontrada' });

      res.json({ message: 'Configuração removida com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = configuracaoController;
