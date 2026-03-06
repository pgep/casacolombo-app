import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImagemService } from '../../services/imagem';
import { Imagem } from '../../models/imagem.model';

@Component({
  selector: 'app-imagem-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './imagem-list.html',
  styleUrls: ['./imagem-list.css']
})
export class ImagemListComponent implements OnInit {
  imagens: Imagem[] = [];
  loading = true;

  constructor(
    private imagemService: ImagemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarImagens();
  }

  carregarImagens() {
    this.loading = true;
    this.imagemService.getImagens().subscribe({
      next: (data) => {
        this.imagens = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar imagens:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir esta imagem?')) {
      this.imagemService.deleteImagem(id).subscribe({
        next: () => {
          alert('Imagem excluída com sucesso!');
          this.carregarImagens();
        },
        error: (err) => {
          console.error('Erro ao deletar:', err);
          alert('Erro ao deletar imagem: ' + (err.error?.error || err.message));
        }
      });
    }
  }

  getBase64Image(base64: string): string {
    return base64.startsWith('data:image') ? base64 : `data:image/jpeg;base64,${base64}`;
  }
}