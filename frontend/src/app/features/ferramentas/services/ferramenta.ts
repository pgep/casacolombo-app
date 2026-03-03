import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ferramenta {
  id?: number;
  nome: string;
  unidadeMedida: string;
  quantidadeEmEstoque: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FerramentaService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) { }

  getFerramentas(): Observable<Ferramenta[]> {
    return this.http.get<Ferramenta[]>(`${this.apiUrl}/ferramentas`);
  }

  getFerramenta(id: number): Observable<Ferramenta> {
    return this.http.get<Ferramenta>(`${this.apiUrl}/ferramentas/${id}`);
  }

  createFerramenta(ferramenta: Ferramenta): Observable<Ferramenta> {
    return this.http.post<Ferramenta>(`${this.apiUrl}/ferramentas`, ferramenta);
  }

  updateFerramenta(id: number, ferramenta: Ferramenta): Observable<Ferramenta> {
    return this.http.put<Ferramenta>(`${this.apiUrl}/ferramentas/${id}`, ferramenta);
  }

  deleteFerramenta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/ferramentas/${id}`);
  }
}