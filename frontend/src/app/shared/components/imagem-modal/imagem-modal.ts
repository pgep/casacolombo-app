import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ModalImagemData } from '../../services/modal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-imagem-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './imagem-modal.html',
  styleUrls: ['./imagem-modal.css']
})
export class ImagemModalComponent implements OnInit, OnDestroy {
  imagem: ModalImagemData | null = null;
  imagemUrl: string = '';
  visible: boolean = false;
  loading: boolean = false;
  
  private subscription: Subscription;

  constructor(
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) {
    console.log('✅ ImagemModalComponent construtor');
    
    this.subscription = this.modalService.modalState$.subscribe({
      next: (data) => {
        console.log('📦 Modal recebeu dados:', data ? 'com imagem' : 'fechar');
        
        if (data) {
          // ABRIR MODAL
          this.imagem = data;
          this.imagemUrl = data.imagem_base64.startsWith('data:image')
            ? data.imagem_base64
            : `data:image/jpeg;base64,${data.imagem_base64}`;
          this.visible = true;
          this.loading = false;
        } else {
          // FECHAR MODAL
          this.visible = false;
          this.loading = false;
          // Limpa depois da animação
          setTimeout(() => {
            this.imagem = null;
            this.imagemUrl = '';
            this.cdr.detectChanges();
          }, 300);
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erro no modal subscription:', err);
      }
    });
  }

  ngOnInit() {
    console.log('✅ ImagemModalComponent ngOnInit');
  }

  ngOnDestroy() {
    console.log('🗑️ Destruindo ImagemModalComponent');
    this.subscription.unsubscribe();
  }

  fechar() {
    this.modalService.fechar();
  }
}