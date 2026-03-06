import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  nome: string;
  descricao?: string;
  tipo_produto_id: number;
  tipo_nome?: string;  // Para exibição na lista (vem do JOIN)
  imagem_id?: number;  // ← NOVO
  imagem_nome?: string; // ← NOVO (para exibir)
  imagem_base64?: string; // ← NOVO (para preview)
  custo_total: number;
  preco_venda: number;
  preco_final?: number;
  ativo: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // GET todos os produtos
  getProdutos(apenasAtivos: boolean = true): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.apiUrl}/produtos?apenasAtivos=${apenasAtivos}`);
  }

  // GET produto por ID
  getProduto(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/produtos/${id}`);
  }

  // POST criar produto
  createProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(`${this.apiUrl}/produtos`, produto);
  }

  // PUT atualizar produto
  updateProduto(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/produtos/${id}`, produto);
  }

  // DELETE excluir produto
  deleteProduto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/produtos/${id}`);
  }

  // Método para buscar tipos de produto (para o select)
  getTiposProduto(apenasAtivos: boolean = true): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipo-produto?apenasAtivos=${apenasAtivos}`);
  }

    // ========== NOVO MÉTODO ==========
  // GET imagens disponíveis
  getImagens(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/imagens`);
  }
  
}