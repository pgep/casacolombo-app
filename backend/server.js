require('dotenv').config();
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

const PORT = process.env.PORT || 3001;

async function initTables() {
  try {
    await Cliente.initTable();
    await Ferramenta.initTable();
    await TipoProduto.initTable();
    await Imagem.initTable();
    await Produto.initTable();
    await TipoInsumo.initTable();
    await Usuario.initTable();
    await UnidadeMedida.initTable();
    console.log('✅ Tabelas inicializadas');
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

initTables().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});
