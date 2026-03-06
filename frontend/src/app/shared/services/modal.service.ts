import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalImagemData {
  id: number;
  nome: string;
  imagem_base64: string;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  // Usar Subject em vez de BehaviorSubject para não reter valores
  private modalSubject = new Subject<ModalImagemData | null>();
  modalState$ = this.modalSubject.asObservable();
  
  private aberto = false; // Controle de estado

  constructor() {
    console.log('✅ ModalService inicializado');
  }

  abrirImagem(imagem: ModalImagemData) {
    // Se já estiver aberto, não abre novamente
    if (this.aberto) {
      console.log('⏳ Modal já está aberto, ignorando novo clique');
      return;
    }
    
    console.log('🖼️ Abrindo modal com imagem:', imagem.nome);
    
    this.aberto = true;
    
    const imagemParaModal = {
      ...imagem,
      imagem_base64: imagem.imagem_base64.startsWith('data:image')
        ? imagem.imagem_base64
        : `data:image/jpeg;base64,${imagem.imagem_base64}`
    };
    
    this.modalSubject.next(imagemParaModal);
  }

  fechar() {
    console.log('❌ Fechando modal');
    this.aberto = false;
    this.modalSubject.next(null);
  }
}