const express = require('express');
const router = express.Router();
const ferramentaController = require('./ferramenta.controller');

// Rotas públicas (por enquanto)
router.get('/', ferramentaController.listar);
router.get('/:id', ferramentaController.buscarPorId);
router.post('/', ferramentaController.criar);
router.put('/:id', ferramentaController.atualizar);
router.delete('/:id', ferramentaController.deletar);

module.exports = router;