require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const Cliente = require('./models/cliente.model'); // ← AGORA É CLIENTE

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar tabela
Cliente.initTable();

// ========== ROTA DE TESTE ==========
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as time, version() as version');
    res.json({ 
      status: 'OK', 
      message: 'Servidor rodando!',
      time: result.rows[0].time,
      database: result.rows[0].version
    });
  } catch (error) {
    console.error('Erro no health check:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Erro ao conectar ao banco',
      error: error.message
    });
  }
});

// ========== ROTAS CRUD - CLIENTES ==========

// GET todos os clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const { apenasAtivos } = req.query;
    const clientes = await Cliente.findAll(apenasAtivos !== 'false');
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET um cliente por ID
app.get('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar novo cliente
app.post('/api/clientes', async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    res.status(201).json(cliente);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Email já cadastrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar cliente
app.put('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.update(req.params.id, req.body);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remover cliente
app.delete('/api/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.delete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Teste: http://localhost:${PORT}/api/health`);
  console.log(`📋 CRUD Clientes: http://localhost:${PORT}/api/clientes`);
});