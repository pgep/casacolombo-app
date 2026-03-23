const db = require('../scr/config/database');
const sharp = require('sharp');

class Imagem {
  static async initTable() {
    // Cria tabela imagens
    await db.query(`
      CREATE TABLE IF NOT EXISTS imagens (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        imagem_base64 TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Adicionar coluna thumbnail se não existir
    try {
      await db.query(`
        ALTER TABLE imagens ADD COLUMN IF NOT EXISTS thumbnail TEXT
      `);
      console.log('✅ Coluna "thumbnail" adicionada/verificada');
    } catch (error) {
      console.log('Coluna thumbnail já existe ou erro:', error.message);
    }

    // NOTA: Não atualizamos automaticamente as thumbnails antigas
    // Elas serão regeneradas conforme necessário ou manualmente
    console.log('✅ Tabela "imagens" verificada/criada');
  }

  // Função auxiliar para gerar thumbnail REAL
  static async gerarThumbnail(imagemBase64, tamanho = 50) {
    try {
      // Verificar se a imagem é válida
      if (!imagemBase64 || !imagemBase64.startsWith('data:image')) {
        console.warn('⚠️ Imagem inválida para gerar thumbnail');
        return null;
      }

      // Extrair o mime type (image/jpeg, image/png, etc)
      const mimeMatch = imagemBase64.match(/^data:image\/(\w+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'jpeg';

      // Extrair o base64 puro (remover o prefixo)
      const base64Data = imagemBase64.replace(/^data:image\/\w+;base64,/, '');

      // Converter base64 para Buffer
      const buffer = Buffer.from(base64Data, 'base64');

      // Redimensionar para um quadrado (tamanho x tamanho)
      const thumbnailBuffer = await sharp(buffer)
        .resize(tamanho, tamanho, {
          fit: 'cover', // Corta para preencher o quadrado
          position: 'centre', // Centraliza o corte
        })
        .jpeg({ quality: 85 }) // Qualidade boa, tamanho reduzido
        .toBuffer();

      // Converter de volta para base64 com o prefixo correto
      const thumbnailBase64 = `data:image/jpeg;base64,${thumbnailBuffer.toString('base64')}`;

      return thumbnailBase64;
    } catch (error) {
      console.error('❌ Erro ao gerar thumbnail:', error.message);
      // Fallback: retorna null (não usa o corte de string)
      return null;
    }
  }

  static async findAll() {
    const result = await db.query('SELECT * FROM imagens ORDER BY id DESC');
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM imagens WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(data) {
    const { nome, imagem_base64 } = data;

    // Gerar thumbnail REAL
    const thumbnail = await this.gerarThumbnail(imagem_base64);

    const result = await db.query(
      'INSERT INTO imagens (nome, imagem_base64, thumbnail) VALUES ($1, $2, $3) RETURNING *',
      [nome, imagem_base64, thumbnail],
    );
    return result.rows[0];
  }

  static async update(id, data) {
    const { nome, imagem_base64 } = data;
    let thumbnail = null;

    // Se veio uma nova imagem, gerar nova thumbnail
    if (imagem_base64) {
      thumbnail = await this.gerarThumbnail(imagem_base64);
    }

    const result = await db.query(
      'UPDATE imagens SET nome = $1, imagem_base64 = $2, thumbnail = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
      [nome, imagem_base64, thumbnail, id],
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      'DELETE FROM imagens WHERE id = $1 RETURNING id',
      [id],
    );
    return result.rows[0];
  }

  static async listarParaSelect() {
    const query = `
      SELECT id, nome 
      FROM imagens 
      ORDER BY nome ASC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async buscarCompleta(id) {
    const query = `
      SELECT id, nome, imagem_base64 
      FROM imagens 
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async listarThumbnails() {
    const result = await db.query(`
      SELECT 
        id, 
        nome, 
        created_at,
        thumbnail
      FROM imagens 
      ORDER BY id DESC
    `);
    return result.rows;
  }

  // Método utilitário para regenerar thumbnails de imagens existentes
  static async regenerarTodasThumbnails() {
    console.log('🔄 Regenerando thumbnails de todas as imagens...');

    const imagens = await this.findAll();
    let atualizadas = 0;

    for (const img of imagens) {
      try {
        const novaThumbnail = await this.gerarThumbnail(img.imagem_base64);
        if (novaThumbnail) {
          await db.query('UPDATE imagens SET thumbnail = $1 WHERE id = $2', [
            novaThumbnail,
            img.id,
          ]);
          atualizadas++;
          console.log(`✅ Imagem ${img.id} (${img.nome}) atualizada`);
        }
      } catch (error) {
        console.error(`❌ Erro ao atualizar imagem ${img.id}:`, error.message);
      }
    }

    console.log(
      `✅ ${atualizadas} de ${imagens.length} thumbnails regeneradas`,
    );
    return atualizadas;
  }
}

module.exports = Imagem;
