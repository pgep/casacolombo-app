import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface UnidadeMedida {
  id?: number;
  nome: string;
  tipo: string;
  fator_conversao: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UnidadeMedidaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUnidades(): Observable<UnidadeMedida[]> {
    return this.http.get<UnidadeMedida[]>(`${this.apiUrl}/unidadeMedida`);
  }

  getUnidade(id: number): Observable<UnidadeMedida> {
    return this.http.get<UnidadeMedida>(`${this.apiUrl}/unidadeMedida/${id}`);
  }

  createUnidade(unidade: UnidadeMedida): Observable<UnidadeMedida> {
    return this.http.post<UnidadeMedida>(`${this.apiUrl}/unidadeMedida`, unidade);
  }

  updateUnidade(id: number, unidade: UnidadeMedida): Observable<UnidadeMedida> {
    return this.http.put<UnidadeMedida>(`${this.apiUrl}/unidadeMedida/${id}`, unidade);
  }

  deleteUnidade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/unidadeMedida/${id}`);
  }
}
