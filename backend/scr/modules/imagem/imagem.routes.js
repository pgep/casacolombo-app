const express = require('express');
const router = express.Router();
const imagemController = require('./imagem.controller');

router.get('/', imagemController.listar); // lista completa (admin)
router.get('/thumbnails', imagemController.listarThumbnails); // NOVA: listagem rápida
router.get('/select', imagemController.listarParaSelect); // só id e nome (para selects)
router.get('/:id', imagemController.buscarPorId); // busca básica
router.get('/:id/completa', imagemController.buscarCompleta); // com base64 (para modal)
router.post('/', imagemController.criar);
router.put('/:id', imagemController.atualizar);
router.delete('/:id', imagemController.deletar);

module.exports = router;
