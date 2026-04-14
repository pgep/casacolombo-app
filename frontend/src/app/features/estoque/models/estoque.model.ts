export interface InsumoEstoque {
  id: number;
  nome: string;
  quantidade_estoque: number;
  estoque_minimo: number;
  unidade_medida_nome: string;
  unidade_medida_sigla?: string;
  fator_conversao: number;
  status?: 'ok' | 'baixo' | 'critico';
}

export interface MovimentacaoEstoque {
  id: number;
  insumo_id: number;
  insumo_nome: string;
  tipo: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  quantidade_antes: number;
  quantidade_depois: number;
  motivo: string;
  referencia_tipo: string;
  created_at: string;
  created_by?: number;
}

export interface AjusteEstoque {
  insumo_id: number;
  tipo: 'entrada' | 'saida' | 'ajuste';
  quantidade: number;
  motivo: string;
}
