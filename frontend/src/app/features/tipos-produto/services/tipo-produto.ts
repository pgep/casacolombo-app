import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface TipoProduto {
  id?: number;
  nome: string;
  ativo: boolean;
  data_cadastro?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TipoProdutoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // GET todos - com parâmetro opcional para ativos/inativos
  getTodos(apenasAtivos: boolean = true): Observable<TipoProduto[]> {
    return this.http.get<TipoProduto[]>(`${this.apiUrl}/tipo-produto?apenasAtivos=${apenasAtivos}`);
  }

  // GET por ID
  getTipo(id: number): Observable<TipoProduto> {
    return this.http.get<TipoProduto>(`${this.apiUrl}/tipo-produto/${id}`);
  }

  // POST criar
  createTipo(tipo: TipoProduto): Observable<TipoProduto> {
    return this.http.post<TipoProduto>(`${this.apiUrl}/tipo-produto`, tipo);
  }

  // PUT atualizar
  updateTipo(id: number, tipo: TipoProduto): Observable<TipoProduto> {
    return this.http.put<TipoProduto>(`${this.apiUrl}/tipo-produto/${id}`, tipo);
  }

  // DELETE excluir
  deleteTipo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tipo-produto/${id}`);
  }
}
