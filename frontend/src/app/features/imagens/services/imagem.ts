import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Imagem } from '../models/imagem.model';

@Injectable({ providedIn: 'root' })
export class ImagemService {
  private apiUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // GET todas as imagens
  getImagens(): Observable<Imagem[]> {
    return this.http.get<Imagem[]>(`${this.apiUrl}/imagens`);
  }

  // GET imagem por ID
  getImagem(id: number): Observable<Imagem> {
    return this.http.get<Imagem>(`${this.apiUrl}/imagens/${id}`);
  }

  // POST criar imagem
  createImagem(imagem: Imagem): Observable<Imagem> {
    return this.http.post<Imagem>(`${this.apiUrl}/imagens`, imagem);
  }

  // PUT atualizar imagem
  updateImagem(id: number, imagem: Imagem): Observable<Imagem> {
    return this.http.put<Imagem>(`${this.apiUrl}/imagens/${id}`, imagem);
  }

  // DELETE excluir imagem
  deleteImagem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/imagens/${id}`);
  }

  // Método auxiliar para converter arquivo para base64
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}