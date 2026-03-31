import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Configuracao } from '../models/configuracao.model';

@Injectable({ providedIn: 'root' })
export class ConfiguracaoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getConfiguracoes(apenasAtivos: boolean = true): Observable<Configuracao[]> {
    return this.http.get<Configuracao[]>(
      `${this.apiUrl}/configuracoes?apenasAtivos=${apenasAtivos}`,
    );
  }

  getConfiguracao(id: number): Observable<Configuracao> {
    return this.http.get<Configuracao>(`${this.apiUrl}/configuracoes/${id}`);
  }

  getByChave(chave: string): Observable<Configuracao> {
    return this.http.get<Configuracao>(`${this.apiUrl}/configuracoes/chave/${chave}`);
  }

  createConfiguracao(config: Configuracao): Observable<Configuracao> {
    return this.http.post<Configuracao>(`${this.apiUrl}/configuracoes`, config);
  }

  updateConfiguracao(id: number, config: Configuracao): Observable<Configuracao> {
    return this.http.put<Configuracao>(`${this.apiUrl}/configuracoes/${id}`, config);
  }

  deleteConfiguracao(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/configuracoes/${id}`);
  }
}
