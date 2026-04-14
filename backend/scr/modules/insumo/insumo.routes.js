const express = require('express');
const router = express.Router();
const controller = require('./insumo.controller');

router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

// ✅ NOVAS ROTAS
router.post('/:id/reativar', controller.reativar);
router.get('/:id/verificar-exclusao', controller.verificarExclusao);

module.exports = router;
