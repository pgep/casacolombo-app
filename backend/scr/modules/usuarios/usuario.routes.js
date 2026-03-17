const express = require('express');
const router = express.Router();
const usuarioController = require('./usuario.controller');

router.get('/', usuarioController.listar);
router.get('/:id', usuarioController.buscarPorId);
router.get('/email/:email', usuarioController.buscarPorEmail);
router.post('/', usuarioController.criar);
router.put('/:id', usuarioController.atualizar);
router.delete('/:id', usuarioController.deletar);

module.exports = router;