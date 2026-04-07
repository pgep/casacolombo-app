const ProducaoProduto = require('../../../models/producaoProduto.model');
const EstoqueMovimentacao = require('../../../models/estoqueMovimentacao.model');
const ProdutoInsumo = require('../../../models/produtoInsumo.model');

const producaoProdutoController = {
  async listar(req, res) {
    try {
      const producoes = await ProducaoProduto.findAll();
      res.json(producoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const producao = await ProducaoProduto.findById(req.params.id);
      if (!producao)
        return res.status(404).json({ message: 'Produção não encontrada' });
      res.json(producao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async criar(req, res) {
    try {
      const { produto_id, quantidade_produzida, observacao } = req.body;

      // 1. Buscar insumos do produto
      const insumos = await ProdutoInsumo.getByProduto(produto_id);

      // 2. Verificar se há estoque suficiente
      for (const item of insumos) {
        const quantidade_necessaria = item.quantidade * quantidade_produzida;
        const insumo = await db.query(
          'SELECT estoque_atual FROM insumos WHERE id = $1',
          [item.insumo_id],
        );
        const estoque_atual = Number(insumo.rows[0]?.estoque_atual) || 0;

        if (estoque_atual < quantidade_necessaria) {
          return res.status(400).json({
            error: `Estoque insuficiente para ${item.nome}. Necessário: ${quantidade_necessaria}, Disponível: ${estoque_atual}`,
          });
        }
      }

      // 3. Registrar produção (código existente)
      const producao = await ProducaoProduto.create(req.body);

      // 4. Dar baixa no estoque de cada insumo
      for (const item of insumos) {
        const quantidade_usada = item.quantidade * quantidade_produzida;
        await EstoqueMovimentacao.registrarMovimentacao({
          insumo_id: item.insumo_id,
          tipo: 'saida',
          quantidade: quantidade_usada,
          motivo: `Produção de ${quantidade_produzida} unidades do produto ID ${produto_id}`,
          referencia_id: producao.id,
          referencia_tipo: 'producao',
          created_by: req.user?.id || null,
        });
      }

      res.status(201).json(producao);
    } catch (error) {
      console.error('Erro ao criar produção:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const producao = await ProducaoProduto.update(req.params.id, req.body);
      if (!producao)
        return res.status(404).json({ message: 'Produção não encontrada' });
      res.json(producao);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const producao = await ProducaoProduto.delete(req.params.id);
      if (!producao)
        return res.status(404).json({ message: 'Produção não encontrada' });
      res.json({ message: 'Produção removida com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = producaoProdutoController;
