// frontend/src/app/features/produtos/models/produto.model.ts

export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  tipo_produto_id: number;
  tipo_nome?: string;
  imagem_id?: number;
  imagem_nome?: string;
  imagem_base64?: string;
  custo_total: number;
  preco_venda: number;
  preco_final?: number;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
  insumos?: ProdutoInsumo[];
}

export interface Imagem {
  id: number;
  nome: string;
  imagem_base64: string;
}

// ✅ EXPORTADA CORRETAMENTE
export interface ProdutoInsumo {
  insumo_id: number;
  quantidade: number;
  nome?: string;
  custo_unitario?: number;
}
