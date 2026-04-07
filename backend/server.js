require('dotenv').config();

// ========== CONFIGURAÇÃO DE AMBIENTE ==========
const isProduction = process.env.NODE_ENV === 'production';
console.log(
  `🌍 Ambiente: ${isProduction ? '🚀 PRODUÇÃO' : '🧪 DESENVOLVIMENTO'}`,
);

// Seleciona a string de conexão correta baseada no ambiente
const DATABASE_URL = isProduction
  ? process.env.DATABASE_URL_PROD
  : process.env.DATABASE_URL_DEV;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não configurada! Verifique seu arquivo .env');
  process.exit(1);
}

// Seta a variável de ambiente para o pool de conexões
process.env.DATABASE_URL = DATABASE_URL;

console.log(
  `🔗 Conectando ao banco: ${isProduction ? '🏭 PRODUÇÃO' : '🧪 DESENVOLVIMENTO'}`,
);

const app = require('./scr/app');

// Importar models para inicializar tabelas
const Cliente = require('./models/cliente.model');
const Ferramenta = require('./models/ferramenta.model');
const TipoProduto = require('./models/tipo-produto.model');
const Produto = require('./models/produto.model');
const Imagem = require('./models/imagem.model');
const TipoInsumo = require('./scr/modules/tipos-insumo/tipo-insumo.model');
const Usuario = require('./scr/modules/usuarios/usuario.model');
const UnidadeMedida = require('./models/unidadeMedida.model');
const Insumo = require('./models/insumo.model');
const Configuracao = require('./models/configuracao.model');
const ProducaoProduto = require('./models/producaoProduto.model');
const EstoqueMovimentacao = require('./models/estoqueMovimentacao.model');

const PORT = process.env.PORT || 3001;

async function initTables() {
  try {
    console.log('📦 Inicializando tabelas...');
    await Cliente.initTable();
    await Ferramenta.initTable();
    await TipoProduto.initTable();
    await Imagem.initTable();
    await Produto.initTable();
    await TipoInsumo.initTable();
    await Usuario.initTable();
    await UnidadeMedida.initTable();
    await Insumo.initTable();
    await Configuracao.initTable();
    await ProducaoProduto.initTable();
    await EstoqueMovimentacao.initTable();
    console.log('✅ Todas as tabelas inicializadas com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar tabelas:', error);
    process.exit(1);
  }
}

initTables().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Health: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Banco: ${isProduction ? 'PRODUÇÃO' : 'DESENVOLVIMENTO'}`);
  });
});
