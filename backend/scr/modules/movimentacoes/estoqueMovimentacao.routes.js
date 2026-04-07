const express = require('express');
const router = express.Router();
const controller = require('./estoqueMovimentacao.controller');

// ✅ IMPORTANTE: Rotas específicas PRIMEIRO
// Rotas sem parâmetros (mais específicas)
router.get('/insumos', controller.listarInsumosComEstoque);
router.get('/alertas/baixo', controller.alertasEstoqueBaixo);

// Rotas com parâmetros fixos
router.get('/insumo/:insumoId', controller.listarPorInsumo);

// Rotas com parâmetros dinâmicos (DEPOIS das específicas)
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);

// Rotas POST (sem problemas de ordem)
router.post('/entrada', controller.registrarEntrada);
router.post('/saida', controller.registrarSaida);
router.post('/ajuste', controller.registrarAjuste);

// DELETE
router.delete('/:id', controller.deletar);

module.exports = router;
