export interface UnidadeMedida {
  id?: number;
  nome: string; // Ex: Litro, ml, kg
  tipo: string; // LIQUIDO, PESO, UNIDADE
  fator_conversao: number; // Ex: 1000 (L -> ml)
  created_at?: string;
  updated_at?: string;
}
