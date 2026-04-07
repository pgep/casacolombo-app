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

  /**
   * Registra uma entrada de insumo no estoque
   * POST /api/estoque-movimentacoes/entrada
   */
  registrarEntrada(dados: {
    insumo_id: number;
    quantidade: number;
    motivo: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/entrada`, dados);
  }

  /**
   * Registra uma saída de insumo do estoque
   * POST /api/estoque-movimentacoes/saida
   */
  registrarSaida(dados: {
    insumo_id: number;
    quantidade: number;
    motivo: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/saida`, dados);
  }

  /**
   * Registra um ajuste manual no estoque
   * POST /api/estoque-movimentacoes/ajuste
   */
  registrarAjuste(ajuste: AjusteEstoque & { quantidade: number; motivo: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/ajuste`, ajuste);
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
