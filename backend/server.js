require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');

// ========== IMPORTAÇÃO DOS MODELS ==========
const Cliente = require('./models/cliente.model');
const Ferramenta = require('./models/ferramenta.model'); 
const TipoProduto = require('./models/tipo-produto.model');
const Produto = require('./models/produto.model');

const app = express();

// ========== MIDDLEWARES ==========
app.use(cors());
app.use(express.json());

// ========== INICIALIZAR TABELAS ==========
async function initTables() {
  try {
    await Cliente.initTable();
    await Ferramenta.initTable();
    await TipoProduto.initTable();
    await Produto.initTable();
    console.log('✅ Todas as tabelas inicializadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar tabelas:', error);
  }
}

// Executar inicialização
initTables();

// ========== ROTA DE TESTE ==========
app.get('/api/health', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as time, version() as version');
    res.json({ 
      status: 'OK', 
      message: 'Servidor rodando!',
      time: result.rows[0].time,
      database: result.rows[0].version,
      tables: ['clientes', 'ferramentas'] // ← NOVO - mostra tabelas disponíveis
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
    if (error.code === '23505') {
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

// ========== ROTAS CRUD - FERRAMENTAS (NOVO) ==========

// GET todas as ferramentas
app.get('/api/ferramentas', async (req, res) => {
  try {
    const ferramentas = await Ferramenta.findAll();
    res.json(ferramentas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET uma ferramenta por ID
app.get('/api/ferramentas/:id', async (req, res) => {
  try {
    const ferramenta = await Ferramenta.findById(req.params.id);
    if (!ferramenta) {
      return res.status(404).json({ message: 'Ferramenta não encontrada' });
    }
    res.json(ferramenta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar nova ferramenta
app.post('/api/ferramentas', async (req, res) => {
  try {
    const { nome, unidadeMedida, quantidadeEmEstoque } = req.body;
    
    // Validação básica
    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const ferramenta = await Ferramenta.create({
      nome,
      unidadeMedida: unidadeMedida || '',
      quantidadeEmEstoque: quantidadeEmEstoque || 0
    });
    
    res.status(201).json(ferramenta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar ferramenta
app.put('/api/ferramentas/:id', async (req, res) => {
  try {
    const ferramenta = await Ferramenta.update(req.params.id, req.body);
    if (!ferramenta) {
      return res.status(404).json({ message: 'Ferramenta não encontrada' });
    }
    res.json(ferramenta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remover ferramenta
app.delete('/api/ferramentas/:id', async (req, res) => {
  try {
    const ferramenta = await Ferramenta.delete(req.params.id);
    if (!ferramenta) {
      return res.status(404).json({ message: 'Ferramenta não encontrada' });
    }
    res.json({ message: 'Ferramenta removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ROTAS CRUD - TIPO PRODUTO ==========

// GET todos os tipos de produtos
app.get('/api/tipo-produto',async (req,res) => {
  try {
    const tipoproduto = await TipoProduto.findAll();
    res.json(tipoproduto);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
  
});

// GET Tipo produto por Id
app.get('/api/tipo-produto/:id', async (req, res) => {
  try {
    const tipoproduto = await TipoProduto.findById(req.params.id);
    if (!tipoproduto) {
      return res.status(400).json({message: 'Tipo produto não encontrado'});
    }
    res.json(tipoproduto);
  }catch(error){
    res.status(500).json({error:error.message});
  }
});

// POST criar novo
app.post('/api/tipo-produto', async(req,res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório'});
    }
    const tipoproduto = await TipoProduto.create({
      nome
    });
    res.status(201).json(tipoproduto);
  } catch (error) {
    res.status(500).json({ erro: erro.message});
  }
});

// PUT atualizar ferramenta
app.put('/api/tipo-produto/:id', async (req,res) => {
 try {
  const tipoproduto = await TipoProduto.update(req.params.id, req.body);
  if (!tipoproduto) {
    return res.status(400).json({ message: 'Tipo produti não encontrado'})
  }
  res.json(tipoproduto);
 } catch (error) {
  res.status(500).json({error:error.message});
 } 
});

// DELETE  remover Tipo Produto

app.delete('/api/tipo-produto/:id', async (req,res) => {
  try {
    const tipoproduto = await TipoProduto.delete(req.params.id);
    if (!tipoproduto) {
      return res.status(404).json({message: 'Tipo produto não encontrado'});
    }
    res.json({ message: 'Tipo produto excluído com sucesso'});
  } catch (error) {
    res.status(500).json({erro:erro.message});
  }
});

// GET todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const { apenasAtivos } = req.query;
    const produtos = await Produto.findAll(apenasAtivos !== 'false');
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST criar novo produto
app.post('/api/produtos', async (req, res) => {
  try {
    const produto = await Produto.create(req.body);
    res.status(201).json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT atualizar produto
app.put('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.update(req.params.id, req.body);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE remover produto
app.delete('/api/produtos/:id', async (req, res) => {
  try {
    const produto = await Produto.delete(req.params.id);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== TRATAMENTO DE ERROS 404 ==========
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// ========== TRATAMENTO DE ERROS GLOBAL ==========
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ========== INICIAR SERVIDOR ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Health: http://localhost:${PORT}/api/health`);
  console.log(`👥 Clientes: http://localhost:${PORT}/api/clientes`);
  console.log(`🔧 Ferramentas: http://localhost:${PORT}/api/ferramentas`);
  console.log(`🔧 Ferramentas: http://localhost:${PORT}/api/tipo-produto`);
  console.log(`🔧 Ferramentas: http://localhost:${PORT}/api/produto`);
});