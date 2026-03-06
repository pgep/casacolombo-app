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
        return res.status(400).json({ error: 'Nome e imagem são obrigatórios' });
      }
      
      const imagem = await Imagem.create({ nome, imagem_base64 });
      res.status(201).json(imagem);
    } catch (error) {
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
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      // Verificar se alguma produto usa esta imagem
      const { rows } = await db.query(
        'SELECT id FROM produtos WHERE imagem_id = $1 LIMIT 1',
        [req.params.id]
      );
      
      if (rows.length > 0) {
        return res.status(400).json({ 
          error: 'Esta imagem está sendo usada por um produto. Remova a referência primeiro.' 
        });
      }
      
      const imagem = await Imagem.delete(req.params.id);
      if (!imagem) {
        return res.status(404).json({ message: 'Imagem não encontrada' });
      }
      res.json({ message: 'Imagem removida com sucesso' });
    } catch (error) {
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
      res.json(imagem); // Retorna { id, nome, imagem_base64 }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

module.exports = imagemController;