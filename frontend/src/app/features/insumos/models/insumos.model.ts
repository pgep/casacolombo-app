export interface Insumo {
  id?: number;
  nome: string;
  unidade_medida_id: number;
  unidade_medida_nome: string;
  quantidade_compra: number;
  valor_compra: number;
  quantidade_base?: number;
  custo_unitario_base?: number;
  custo_unitario: number;
  quantidade_estoque?: number;
  unidade_nome?: string; // vem do join
  tipo?: string; // vem do join
  created_at?: string;
  updated_at?: string;
}
