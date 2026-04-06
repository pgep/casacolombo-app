// frontend/src/app/features/producao-produtos/services/producao.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Producao } from '../models/producao.model';

@Injectable({ providedIn: 'root' })
export class ProducaoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducoes(): Observable<Producao[]> {
    return this.http.get<Producao[]>(`${this.apiUrl}/producao-produtos`);
  }

  getProducao(id: number): Observable<Producao> {
    return this.http.get<Producao>(`${this.apiUrl}/producao-produtos/${id}`);
  }

  createProducao(data: Producao): Observable<Producao> {
    return this.http.post<Producao>(`${this.apiUrl}/producao-produtos`, data);
  }

  updateProducao(id: number, data: Producao): Observable<Producao> {
    return this.http.put<Producao>(`${this.apiUrl}/producao-produtos/${id}`, data);
  }

  deleteProducao(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/producao-produtos/${id}`);
  }

  // Buscar produtos para o select
  getProdutosParaSelect(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produtos?apenasAtivos=true`);
  }
}
