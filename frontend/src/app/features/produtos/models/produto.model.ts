export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  tipo_produto_id: number;
  tipo_nome?: string;  // Para exibição (vem do JOIN)
  imagem_id?: number;  // ← NOVO
  imagem_nome?: string; // ← NOVO (para exibir)
  imagem_base64?: string; // ← NOVO (para preview)
  custo_total: number;
  preco_venda: number;
  preco_final?: number;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

// Interface auxiliar para imagem
export interface Imagem {
  id: number;
  nome: string;
  imagem_base64: string;
}