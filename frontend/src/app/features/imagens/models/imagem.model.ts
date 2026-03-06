export interface Imagem {
  id?: number;
  nome: string;
  imagem_base64: string;
  created_at?: string;
  updated_at?: string;
}

// Interface para exibir na lista com prévia
export interface ImagemComPreview extends Imagem {
  preview?: string;
}