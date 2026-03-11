const db = require('../../config/database');
const Ferramenta = require('./ferramenta.model');

const ferramentaController = {
  // Método auxiliar para verificar nome duplicado
  async verificarNomeDuplicado(nome, idIgnorar = null) {
    let query = 'SELECT id FROM ferramentas WHERE LOWER(nome) = LOWER($1)';
    const params = [nome];
    
    if (idIgnorar) {
      query += ' AND id != $2';
      params.push(idIgnorar);
    }
    
    const result = await db.query(query, params);
    return result.rows.length > 0;
  },

  // GET todas as ferramentas
  async listar(req, res) {
    try {
      const ferramentas = await Ferramenta.findAll();
      res.json(ferramentas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET uma ferramenta por ID
  async buscarPorId(req, res) {
    try {
      const ferramenta = await Ferramenta.findById(req.params.id);
      if (!ferramenta) {
        return res.status(404).json({ message: 'Ferramenta não encontrada' });
      }
      res.json(ferramenta);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST criar nova ferramenta
  async criar(req, res) {
    try {
      const { nome, unidadeMedida, quantidadeEmEstoque } = req.body;
      
      // Validar campo obrigatório
      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }
      
      // VERIFICAR SE JÁ EXISTE FERRAMENTA COM ESTE NOME
      const existe = await this.verificarNomeDuplicado(nome);
      
      if (existe) {
        return res.status(409).json({ 
          error: 'Já existe uma ferramenta cadastrada com este nome',
          campo: 'nome'
        });
      }

      const ferramenta = await Ferramenta.create({
        nome,
        unidadeMedida: unidadeMedida || '',
        quantidadeEmEstoque: quantidadeEmEstoque || 0
      });
      
      res.status(201).json(ferramenta);
    } catch (error) {
      console.error('Erro ao criar ferramenta:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // PUT atualizar ferramenta
  async atualizar(req, res) {
    try {
      const { nome, unidadeMedida, quantidadeEmEstoque } = req.body;
      const id = req.params.id;
      
      // Validar campo obrigatório
      if (!nome) {
        return res.status(400).json({ error: 'Nome é obrigatório' });
      }
      
      // VERIFICAR SE JÁ EXISTE OUTRA FERRAMENTA COM ESTE NOME (ignorando a atual)
      const existe = await this.verificarNomeDuplicado(nome, id);
      
      if (existe) {
        return res.status(409).json({ 
          error: 'Já existe outra ferramenta cadastrada com este nome',
          campo: 'nome'
        });
      }

      const ferramenta = await Ferramenta.update(id, {
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
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE remover ferramenta
  async deletar(req, res) {
    try {
      const ferramenta = await Ferramenta.delete(req.params.id);
      if (!ferramenta) {
        return res.status(404).json({ message: 'Ferramenta não encontrada' });
      }
      res.json({ message: 'Ferramenta removida com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar ferramenta:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ferramentaController;