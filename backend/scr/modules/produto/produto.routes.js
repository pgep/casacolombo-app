const express = require('express');
const router = express.Router();
const produtoController = require('./produto.controller');

router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.deletar);
router.get('/:id/insumos', produtoController.listarInsumos);

module.exports = router;
