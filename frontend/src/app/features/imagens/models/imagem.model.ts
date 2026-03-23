export interface Imagem {
  id?: number;
  nome: string;
  imagem_base64: string;
  created_at?: string;
  updated_at?: string;
}

// imagem.model.ts
export interface ImagemThumbnail {
  id: number;
  nome: string;
  thumbnail: string; // Miniatura para listagem
  created_at: string;
}

export interface ImagemCompleta {
  id: number;
  nome: string;
  imagem_base64: string; // Imagem completa para modal
  created_at: string;
}

// Interface para exibir na lista com prévia
export interface ImagemComPreview extends Imagem {
  preview?: string;
}
