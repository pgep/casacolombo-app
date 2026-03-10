const express = require('express');
const router = express.Router();
const tipoInsumoController = require('./tipo-insumo.controller');

router.get('/', tipoInsumoController.listar);
router.get('/:id', tipoInsumoController.buscarPorId);
router.post('/', tipoInsumoController.criar);
router.put('/:id', tipoInsumoController.atualizar);
router.delete('/:id', tipoInsumoController.deletar);

module.exports = router;