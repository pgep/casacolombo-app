// frontend/src/app/features/estoque/services/estoque.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InsumoEstoque, MovimentacaoEstoque, AjusteEstoque } from '../models/estoque.model';

@Injectable({ providedIn: 'root' })
export class EstoqueService {
  // ✅ URL BASE CORRETA - já inclui /estoque-movimentacoes
  private apiUrl = `${environment.apiUrl}/estoque-movimentacoes`;

  constructor(private http: HttpClient) {}

  // ========== INSUMOS ==========

  /**
   * Lista todos os insumos com informações de estoque
   * GET /api/estoque-movimentacoes/insumos
   */
  getInsumosEstoque(): Observable<InsumoEstoque[]> {
    return this.http.get<InsumoEstoque[]>(`${this.apiUrl}/insumos`);
  }

  /**
   * Lista insumos com estoque baixo ou crítico
   * GET /api/estoque-movimentacoes/alertas/baixo
   */
  getAlertasEstoqueBaixo(): Observable<InsumoEstoque[]> {
    return this.http.get<InsumoEstoque[]>(`${this.apiUrl}/alertas/baixo`);
  }

  // ========== MOVIMENTAÇÕES (CONSULTA) ==========

  /**
   * Lista todas movimentações ou filtradas por insumo
   * GET /api/estoque-movimentacoes
   * GET /api/estoque-movimentacoes/insumo/:insumoId
   */
  getMovimentacoes(insumoId?: number): Observable<MovimentacaoEstoque[]> {
    const url = insumoId ? `${this.apiUrl}/insumo/${insumoId}` : `${this.apiUrl}`;
    return this.http.get<MovimentacaoEstoque[]>(url);
  }

  /**
   * Busca uma movimentação específica por ID
   * GET /api/estoque-movimentacoes/:id
   */
  getMovimentacao(id: number): Observable<MovimentacaoEstoque> {
    return this.http.get<MovimentacaoEstoque>(`${this.apiUrl}/${id}`);
  }

  // ========== MOVIMENTAÇÕES (REGISTRO) ==========

  // ADICIONAR este método único:
  /**
   * Registra qualquer movimentação de estoque (entrada, saída ou ajuste)
   * POST /api/estoque-movimentacoes/movimentar
   *
   * @param dados - Objeto com os dados da movimentação
   * @param dados.insumo_id - ID do insumo
   * @param dados.tipo - 'entrada' | 'saida' | 'ajuste'
   * @param dados.quantidade - Quantidade (sempre positiva)
   * @param dados.motivo - Motivo da movimentação
   */
  registrarMovimentacao(dados: {
    insumo_id: number;
    tipo: 'entrada' | 'saida' | 'ajuste';
    quantidade: number;
    motivo: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/movimentar`, dados);
  }

  // ========== DELETE ==========

  /**
   * Remove uma movimentação do histórico
   * DELETE /api/estoque-movimentacoes/:id
   */
  deletarMovimentacao(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
