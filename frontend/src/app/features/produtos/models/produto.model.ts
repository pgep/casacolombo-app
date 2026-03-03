export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  tipo_produto_id: number;
  tipo_nome?: string;  // Para exibição na lista (vem do JOIN)
  custo_total: number;
  preco_venda: number;
  preco_final?: number;
  imagem?: string;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}