// frontend/src/app/features/produtos/services/produto.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Produto, ProdutoInsumo } from '../models/produto.model';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProdutos(apenasAtivos: boolean = true): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/produtos?apenasAtivos=${apenasAtivos}`);
  }

  getProduto(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/produtos/${id}`);
  }

  createProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}/produtos`, produto);
  }

  updateProduto(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/produtos/${id}`, produto);
  }

  deleteProduto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/produtos/${id}`);
  }

  getTiposProduto(apenasAtivos: boolean = true): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipo-produto?apenasAtivos=${apenasAtivos}`);
  }

  // ✅ NOVO: buscar insumos de um produto
  getInsumosByProduto(produtoId: number): Observable<ProdutoInsumo[]> {
    return this.http.get<ProdutoInsumo[]>(`${this.apiUrl}/produtos/${produtoId}/insumos`);
  }
}
