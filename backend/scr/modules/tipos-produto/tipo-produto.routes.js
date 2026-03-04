const express = require('express');
const router = express.Router();
const tipoprodutoController = require('./tipo-produto.controller');

router.get('/', tipoprodutoController.listar);
router.get('/:id', tipoprodutoController.buscarPorId);
router.post('/', tipoprodutoController.criar);
router.put('/:id', tipoprodutoController.atualizar);
router.delete('/:id', tipoprodutoController.deletar);

module.exports = router;