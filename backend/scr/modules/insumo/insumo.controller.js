const Insumo = require('../../../models/insumo.model');
const EstoqueMovimentacao = require('../../../models/estoqueMovimentacao.model');

const controller = {
  async listar(req, res) {
    try {
      const { incluirInativos } = req.query;
      const data = await Insumo.findAll(incluirInativos === 'true');
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const item = await Insumo.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Não encontrado' });
      res.json(item);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
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

  // ✅ MÉTODO ALTERADO - Delete ou Inativa (com validação de estoque)
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const resultado = await Insumo.deleteOrInactivate(id);

      res.json(resultado);
    } catch (error) {
      console.error('Erro ao deletar/inativar insumo:', error);

      // Tratamento específico para erro de estoque positivo
      if (
        error.message.includes('Não é possível excluir') ||
        error.message.includes('estoque atual é')
      ) {
        return res.status(400).json({ error: error.message });
      }

      // Erro de chave estrangeira (proteção extra)
      if (error.code === '23503') {
        return res.status(400).json({
          error:
            'Não é possível excluir este insumo. Ele possui histórico de movimentações ou está vinculado a produtos.',
          acao: 'inativar',
        });
      }

      res.status(500).json({ error: error.message });
    }
  },

  // ✅ MÉTODO NOVO - Reativar insumo inativado
  async reativar(req, res) {
    try {
      const { id } = req.params;
      const insumo = await Insumo.reativar(id);

      res.json({
        message: 'Insumo reativado com sucesso',
        insumo,
      });
    } catch (error) {
      console.error('Erro ao reativar insumo:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // ✅ MÉTODO NOVO - Verificar possibilidade de exclusão (consulta prévia)
  async verificarExclusao(req, res) {
    try {
      const { id } = req.params;
      const verificacao = await Insumo.podeExcluirFisicamente(id);
      res.json(verificacao);
    } catch (error) {
      console.error('Erro ao verificar exclusão:', error);
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = controller;
