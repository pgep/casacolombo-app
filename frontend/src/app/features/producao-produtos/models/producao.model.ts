export interface Producao {
  id?: number;
  produto_id: number;
  produto_nome?: string;
  quantidade_produzida: number;
  quantidade_disponivel: number;
  custo_total_producao: number;
  custo_unitario_producao: number;
  data_producao?: string;
  observacao?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProducaoFormData {
  produto_id: number;
  quantidade_produzida: number;
  observacao?: string;
}
