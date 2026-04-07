const express = require('express');
const cors = require('cors');
const app = express();

// Rotas
const clienteRoutes = require('./modules/clientes/cliente.routes');
const ferramentaRoutes = require('./modules/ferramentas/ferramenta.routes');
const tipoProdutoRoutes = require('./modules/tipos-produto/tipo-produto.routes');
const produtoRoutes = require('./modules/produto/produto.routes');
const imagemRoutes = require('./modules/imagem/imagem.routes');
const tipoInsumoRoutes = require('./modules/tipos-insumo/tipo-insumo.routes');
const usuarioRoutes = require('./modules/usuarios/usuario.routes');
const unidadeMedidaRoutes = require('./modules/unidade-medida/unidadeMedida.routes');
const insumoRoutes = require('./modules/insumo/insumo.routes');
const configuracaoRoutes = require('./modules/configuracao/configuracao.routes');
const producaoProduto = require('./modules/producaoProduto/producaoProduto.routes');
const estoqueMovimentacaoRoutes = require('./modules/movimentacoes/estoqueMovimentacao.routes');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/clientes', clienteRoutes);
app.use('/api/ferramentas', ferramentaRoutes);
app.use('/api/tipo-produto', tipoProdutoRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/imagens', imagemRoutes);
app.use('/api/tipos-insumo', tipoInsumoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/unidadeMedida', unidadeMedidaRoutes);
app.use('/api/insumo', insumoRoutes);
app.use('/api/configuracoes', configuracaoRoutes);
app.use('/api/producao-produtos', producaoProduto);
app.use('/api/estoque-movimentacoes', estoqueMovimentacaoRoutes);
// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor rodando!',
    modules: ['clientes', 'ferramentas'],
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error('Erro global:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;
