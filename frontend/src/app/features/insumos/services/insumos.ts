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

  getInsumos(): Observable<Insumo[]> {
    return this.http.get<Insumo[]>(`${this.apiUrl}/insumo`);
  }

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
}
