// backend/config/database.js
const { Pool } = require('pg');

// Criar pool de conexões
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true, // Neon exige SSL
  },
  max: 5, // Máximo de conexões simultâneas
  idleTimeoutMillis: 30000, // Tempo máximo ocioso
});

// Testar conexão (opcional)
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erro ao conectar no Neon:', err.stack);
  } else {
    console.log('✅ Conectado ao Neon PostgreSQL com sucesso!');
    release();
  }
});

module.exports = pool;