const express = require('express');
const router = express.Router();
const imagemController = require('./imagem.controller');

router.get('/', imagemController.listar);
router.get('/:id', imagemController.buscarPorId);
router.post('/', imagemController.criar);
router.put('/:id', imagemController.atualizar);
router.delete('/:id', imagemController.deletar);

module.exports = router;