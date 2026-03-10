import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoInsumo } from '../models/tipo-insumo.model';

@Injectable({ providedIn: 'root' })
export class TipoInsumoService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // GET todos
  getTodos(apenasAtivos: boolean = true): Observable<TipoInsumo[]> {
    return this.http.get<TipoInsumo[]>(`${this.apiUrl}/tipos-insumo?apenasAtivos=${apenasAtivos}`);
  }

  // GET por ID
  getTipo(id: number): Observable<TipoInsumo> {
    return this.http.get<TipoInsumo>(`${this.apiUrl}/tipos-insumo/${id}`);
  }

  // POST criar
  createTipo(tipo: TipoInsumo): Observable<TipoInsumo> {
    return this.http.post<TipoInsumo>(`${this.apiUrl}/tipos-insumo`, tipo);
  }

  // PUT atualizar
  updateTipo(id: number, tipo: TipoInsumo): Observable<TipoInsumo> {
    return this.http.put<TipoInsumo>(`${this.apiUrl}/tipos-insumo/${id}`, tipo);
  }

  // DELETE excluir
  deleteTipo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tipos-insumo/${id}`);
  }
}