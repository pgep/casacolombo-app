const Insumo = require('../../../models/insumo.model');
const EstoqueMovimentacao = require('../../../models/estoqueMovimentacao.model');

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
    try {
      // 1. Criar o insumo
      const insumo = await Insumo.create(req.body);

      // 2. ✅ Registrar movimentação de entrada automática
      if (insumo && insumo.quantidade_base && insumo.quantidade_base > 0) {
        try {
          await EstoqueMovimentacao.registrarEntrada(
            insumo.id,
            insumo.quantidade_base,
            `Compra inicial - Cadastro do insumo ${insumo.nome} (${insumo.quantidade_compra} ${insumo.unidade_nome || 'un'})`,
          );
          console.log(
            `✅ Movimentação de entrada registrada para insumo ${insumo.id}`,
          );
        } catch (movimentoError) {
          console.error(
            '❌ Erro ao registrar movimentação automática:',
            movimentoError,
          );
          // Não impede o cadastro do insumo, só loga o erro
        }
      }

      res.status(201).json(insumo);
    } catch (e) {
      console.error('Erro ao criar insumo:', e);
      res.status(500).json({ error: e.message });
    }
  },

  async atualizar(req, res) {
    try {
      const item = await Insumo.update(req.params.id, req.body);
      res.json(item);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async deletar(req, res) {
    try {
      await Insumo.delete(req.params.id);
      res.json({ message: 'Removido' });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};

module.exports = controller;
