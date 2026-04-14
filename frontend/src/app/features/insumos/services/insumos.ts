import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Insumo } from '../models/insumos.model';

@Injectable({
  providedIn: 'root',
})
export class InsumoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getInsumo(id: number): Observable<Insumo> {
    return this.http.get<Insumo>(`${this.apiUrl}/insumo/${id}`);
  }

  createInsumo(insumo: Insumo): Observable<Insumo> {
    return this.http.post<Insumo>(`${this.apiUrl}/insumo`, insumo);
  }

  updateInsumo(id: number, insumo: Insumo): Observable<Insumo> {
    return this.http.put<Insumo>(`${this.apiUrl}/insumo/${id}`, insumo);
  }

  deleteInsumo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/insumo/${id}`);
  }

  // ✅ NOVOS MÉTODOS
  reativar(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/reativar`, {});
  }

  // ✅ MÉTODO ALTERADO - Aceitar parâmetro incluirInativos
  getInsumos(incluirInativos: boolean = false): Observable<Insumo[]> {
    const params = incluirInativos ? '?incluirInativos=true' : '';
    return this.http.get<Insumo[]>(`${this.apiUrl}/insumo/${params}`);
  }

  // ✅ MÉTODO NOVO - Reativar insumo
  reativarInsumo(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/insumo/${id}/reativar`, {});
  }

  // ✅ MÉTODO NOVO - Verificar exclusão (opcional, para validação prévia)
  verificarExclusao(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/insumo/${id}/verificar-exclusao`);
  }
}
