const db = require('../../config/database');
const Produto = require('../../../models/produto.model');
const Configuracao = require('../../../models/configuracao.model');
const ProdutoInsumo = require('../../../models/produtoInsumo.model');

async function verificarNomeDuplicado(nome, idIgnorar = null) {
  // ✅ CORRIGIDO
  let query = 'SELECT id FROM produtos WHERE LOWER(nome) = LOWER($1)';
  const params = [nome];
  if (idIgnorar) {
    query += ' AND id != $2';
    params.push(idIgnorar);
  }
  const result = await db.query(query, params);
  return result.rows.length > 0;
}

async function calcularCusto(insumos) {
  let total = 0;
  for (const item of insumos) {
    total += item.quantidade * item.custo_unitario;
  }
  return total;
}

const produtoController = {
  // ✅ CORRIGIDO
  async listar(req, res) {
    try {
      const produtos = await Produto.findAll(
        req.query.apenasAtivos !== 'false',
      );
      res.json(produtos);
    } catch (error) {
      console.error('Erro ao listar produtos:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const produto = await Produto.findById(req.params.id);
      if (!produto)
        return res.status(404).json({ message: 'Produto não encontrado' });

      // Buscar insumos do produto
      const insumos = await ProdutoInsumo.getByProduto(req.params.id);
      res.json({ ...produto, insumos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async criar(req, res) {
    try {
      const { insumos = [], ...produtoData } = req.body;

      const custo_total = await calcularCusto(insumos);
      const config = await Configuracao.findByChave('margem_padrao');
      const margem = config ? Number(config.valor) : 2;
      const preco_venda = custo_total * margem;

      const produto = await Produto.create({
        ...produtoData,
        custo_total,
        preco_venda,
        preco_final: preco_venda,
      });

      for (const item of insumos) {
        await ProdutoInsumo.create({
          produto_id: produto.id,
          insumo_id: item.insumo_id,
          quantidade: item.quantidade,
          custo_unitario: item.custo_unitario,
        });
      }

      res.status(201).json(produto);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const { insumos = [] } = req.body;

      const custo_total = await calcularCusto(insumos);
      const config = await Configuracao.findByChave('margem_padrao');
      const margem = config ? Number(config.valor) : 2;
      const preco_venda = custo_total * margem;

      const produto = await Produto.update(req.params.id, {
        ...req.body,
        custo_total,
        preco_venda,
      });

      await ProdutoInsumo.deleteByProduto(req.params.id);

      for (const item of insumos) {
        await ProdutoInsumo.create({
          produto_id: req.params.id,
          insumo_id: item.insumo_id,
          quantidade: item.quantidade,
          custo_unitario: item.custo_unitario,
        });
      }

      res.json(produto);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      res.status(500).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const produto = await Produto.delete(req.params.id);
      if (!produto)
        return res.status(404).json({ message: 'Produto não encontrado' });
      res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async listarInsumos(req, res) {
    try {
      const produtoId = req.params.id;
      const insumos = await ProdutoInsumo.getByProduto(produtoId);
      res.json(insumos);
    } catch (error) {
      console.error('Erro ao listar insumos do produto:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = produtoController;
