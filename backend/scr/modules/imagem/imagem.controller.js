// ❌ REMOVA ESTA LINHA (não precisamos do db neste controller)
// const db = require('../../../config/database');

const Imagem = require('../../../models/imagem.model');

const imagemController = {
  async listar(req, res) {
    try {
      const imagens = await Imagem.findAll();
      res.json(imagens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const imagem = await Imagem.findById(req.params.id);
      if (!imagem) {
        return res.status(404).json({ message: 'Imagem não encontrada' });
      }
      res.json(imagem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async criar(req, res) {
    try {
      const { nome, imagem_base64 } = req.body;

      if (!nome || !imagem_base64) {
        return res
          .status(400)
          .json({ error: 'Nome e imagem são obrigatórios' });
      }

      const imagem = await Imagem.create({ nome, imagem_base64 });
      res.status(201).json(imagem);
    } catch (error) {
      console.error('Erro ao criar imagem:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const imagem = await Imagem.update(req.params.id, req.body);
      if (!imagem) {
        return res.status(404).json({ message: 'Imagem não encontrada' });
      }
      res.json(imagem);
    } catch (error) {
      console.error('Erro ao atualizar imagem:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      // NOTA: Verificação de uso por produtos foi removida
      // Se precisar, o model já cuida disso
      const imagem = await Imagem.delete(req.params.id);
      if (!imagem) {
        return res.status(404).json({ message: 'Imagem não encontrada' });
      }
      res.json({ message: 'Imagem removida com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar imagem:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/imagens/select - para listas suspensas (só id e nome)
  async listarParaSelect(req, res) {
    try {
      const imagens = await Imagem.listarParaSelect();
      res.json(imagens);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/imagens/:id/completa - para o modal (com base64)
  async buscarCompleta(req, res) {
    try {
      const imagem = await Imagem.buscarCompleta(req.params.id);
      if (!imagem) {
        return res.status(404).json({ message: 'Imagem não encontrada' });
      }
      res.json(imagem);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // NOVO: GET /api/imagens/thumbnails - listagem rápida
  async listarThumbnails(req, res) {
    try {
      const imagens = await Imagem.listarThumbnails();
      res.json(imagens);
    } catch (error) {
      console.error('❌ Erro ao listar thumbnails:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = imagemController;
