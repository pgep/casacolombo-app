const express = require('express');
const router = express.Router();
const essenciaController = require('./essencia.controller');

router.post('/', essenciaController.criar);
router.get('/', essenciaController.listar);
router.get('/:id', essenciaController.buscarPorId);
router.put('/:id', essenciaController.atualizar);
router.delete('/:id', essenciaController.deletar);

module.exports = router;