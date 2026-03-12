import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  
  constructor(private toastService: ToastService) {}

  tratarErro(err: any, operacao: string, entidade: string = 'registro') {
    // Erro de duplicidade (status 409)
    if (err.status === 409) {
      this.toastService.error(
        err.error?.error || `Este ${entidade} já está cadastrado!`, 
        'Registro duplicado'
      );
    }
    // Erro de validação (status 400)
    else if (err.status === 400) {
      this.toastService.error(
        err.error?.error || 'Dados inválidos', 
        'Validação'
      );
    }
    // Erro de conexão (status 0)
    else if (err.status === 0) {
      this.toastService.error(
        'Erro de conexão com o servidor. Verifique se o backend está rodando.',
        'Conexão falhou'
      );
    }
    // Erro 404 - Não encontrado
    else if (err.status === 404) {
      this.toastService.error(
        err.error?.message || `${entidade} não encontrado`,
        'Não encontrado'
      );
    }
    // Erro 500 - Erro interno
    else if (err.status === 500) {
      this.toastService.error(
        'Erro interno do servidor. Tente novamente mais tarde.',
        'Erro no servidor'
      );
    }
    // Outros erros
    else {
      this.toastService.error(
        `Erro ao ${operacao} ${entidade}: ${err.error?.error || err.message || 'Erro desconhecido'}`,
        'Erro'
      );
    }

    // Log do erro completo no console (para debug)
    console.error(`[${entidade}] Erro ao ${operacao}:`, err);
  }
}