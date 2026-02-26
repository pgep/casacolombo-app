const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Importação das rotas
const clienteRoutes = require('./modules/clientes/cliente.routes');
const ferramentaRoutes = require('./modules/ferramentas/ferramenta.routes');

// Registro das rotas
app.use('/api/clientes', clienteRoutes);
app.use('/api/ferramentas', ferramentaRoutes);

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Servidor rodando!',
    modules: ['clientes', 'ferramentas']
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