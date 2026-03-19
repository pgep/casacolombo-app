const Usuario = require('./usuario.model');

const usuarioController = {
  // GET /api/usuarios
  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      res.json(usuarios);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/usuarios/:id
  async buscarPorId(req, res) {
    try {
      const usuario = await Usuario.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // GET /api/usuarios/email/:email
  async buscarPorEmail(req, res) {
    try {
      const { email } = req.params;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error:
            'Formato de e-mail inválido. Certifique-se de incluir @ e um domínio.',
        });
      }

      const usuario = await Usuario.findByEmail(email);

      if (!usuario) {
        return res
          .status(404)
          .json({ message: 'E-mail não cadastrado na base!' });
      }
      return res.json(usuario);
    } catch (error) {
      console.error('Erro detalhado:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // POST /api/usuarios
  async criar(req, res) {
    try {
      const { nome, email, senha, nivel, ativo } = req.body;

      // Validações básicas
      if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' });
      if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
      if (!senha) return res.status(400).json({ error: 'Senha é obrigatória' });

      const emailJaExiste = await Usuario.emailExiste(email);
      if (emailJaExiste) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }

      const nomeJaExiste = await Usuario.nomeExiste(nome);
      if (nomeJaExiste) {
        return res.status(409).json({ error: 'Nome já cadastrado' });
      }

      const usuario = await Usuario.create({
        nome,
        email,
        senha,
        nivel,
        ativo,
      });
      res.status(201).json(usuario);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // PUT /api/usuarios/:id
  async atualizar(req, res) {
    try {
      const { nome, email, senha, nivel, ativo } = req.body;
      const id = req.params.id;
      const emailJaExiste = await Usuario.emailExisteComExcecao(email, id);
      if (emailJaExiste) {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }
      console.error(res.body);
      const usuario = await Usuario.update(id, {
        nome,
        email,
        senha,
        nivel,
        ativo,
      });
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json(usuario);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Email já cadastrado' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE /api/usuarios/:id
  async deletar(req, res) {
    try {
      const usuario = await Usuario.delete(req.params.id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      res.json({ message: 'Usuário removido com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = usuarioController;
