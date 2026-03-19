export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string; // Opcional, não enviar na listagem
  nivel: 'Selecione...' | 'admin' | 'operador' | 'visualizador';
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}
