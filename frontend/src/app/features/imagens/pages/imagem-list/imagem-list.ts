import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ImagemService } from '../../services/imagem';
import { Imagem } from '../../models/imagem.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-imagem-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
  ],
  templateUrl: './imagem-list.html',
  styleUrls: ['./imagem-list.css'],
})
export class ImagemListComponent implements OnInit {
  dataSource = new MatTableDataSource<Imagem>([]);
  loading = true;

  constructor(
    private imagemService: ImagemService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarImagens();
  }

  carregarImagens() {
    this.loading = true;
    this.imagemService.getImagens().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar imagens:', err);
        this.toastService.error('Erro ao carregar imagens');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir esta imagem?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.imagemService.deleteImagem(id).subscribe({
      next: () => {
        this.toastService.success('Imagem excluída com sucesso!');
        this.carregarImagens();
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        this.toastService.error('Erro ao deletar imagem: ' + (err.error?.error || err.message));
      },
    });
  }

  getBase64Image(base64: string): string {
    return base64.startsWith('data:image') ? base64 : `data:image/jpeg;base64,${base64}`;
  }
}
