import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }

  crieteUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/usuarios`, usuario);
  }

  updateUsuario(id: Number, usuario: Usuario): Observable<Usuario> {
    console.log('usuario doserviço', usuario);
    return this.http.put<Usuario>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  deleteUsuario(id: Number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.apiUrl}/usuarios/${id}`);
  }
}
