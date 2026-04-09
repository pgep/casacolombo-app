const EstoqueMovimentacao = require('../../../models/estoqueMovimentacao.model');

const controller = {
  // ✅ Listar todos os insumos com estoque
  async listarInsumosComEstoque(req, res) {
    try {
      const insumos = await EstoqueMovimentacao.listarInsumosComEstoque();
      res.json(insumos);
    } catch (error) {
      console.error('Erro ao listar insumos:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Alertas de estoque baixo
  async alertasEstoqueBaixo(req, res) {
    try {
      const alertas = await EstoqueMovimentacao.alertasEstoqueBaixo();
      res.json(alertas);
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Listar movimentações por insumo
  async listarPorInsumo(req, res) {
    try {
      const { insumoId } = req.params;
      const movimentacoes = await EstoqueMovimentacao.findByInsumo(insumoId);
      res.json(movimentacoes);
    } catch (error) {
      console.error('Erro ao listar movimentações por insumo:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Listar todas movimentações
  async listar(req, res) {
    try {
      const movimentacoes = await EstoqueMovimentacao.findAll();
      res.json(movimentacoes);
    } catch (error) {
      console.error('Erro ao listar movimentações:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Buscar movimentação por ID
  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const movimentacao = await EstoqueMovimentacao.findById(id);
      if (!movimentacao) {
        return res.status(404).json({ error: 'Movimentação não encontrada' });
      }
      res.json(movimentacao);
    } catch (error) {
      console.error('Erro ao buscar movimentação:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Registrar entrada
  async registrarEntrada(req, res) {
    try {
      const { insumo_id, quantidade, motivo } = req.body;

      if (!insumo_id || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const movimentacao = await EstoqueMovimentacao.registrarEntrada(
        insumo_id,
        quantidade,
        motivo,
      );
      res.status(201).json(movimentacao);
    } catch (error) {
      console.error('Erro ao registrar entrada:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Registrar saída
  async registrarSaida(req, res) {
    try {
      const { insumo_id, quantidade, motivo } = req.body;

      if (!insumo_id || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const movimentacao = await EstoqueMovimentacao.registrarSaida(
        insumo_id,
        quantidade,
        motivo,
      );
      res.status(201).json(movimentacao);
    } catch (error) {
      console.error('Erro ao registrar saída:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Registrar ajuste
  async registrarAjuste(req, res) {
    try {
      const { insumo_id, quantidade, motivo, tipo } = req.body;

      if (!insumo_id || !quantidade || quantidade <= 0) {
        return res.status(400).json({ error: 'Dados inválidos' });
      }

      const movimentacao = await EstoqueMovimentacao.registrarAjuste(
        insumo_id,
        quantidade,
        motivo,
        tipo,
      );
      res.status(201).json(movimentacao);
    } catch (error) {
      console.error('Erro ao registrar ajuste:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ Deletar movimentação
  async deletar(req, res) {
    try {
      const { id } = req.params;
      await EstoqueMovimentacao.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar movimentação:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = controller;
