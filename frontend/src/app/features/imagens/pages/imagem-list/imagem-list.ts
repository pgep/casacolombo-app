import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ImagemService, ImagemThumbnail } from '../../services/imagem';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-imagem-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './imagem-list.html',
  styleUrls: ['./imagem-list.css'],
})
export class ImagemListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'data', 'thumbnail', 'acoes'];
  dataSource = new MatTableDataSource<ImagemThumbnail>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private imagemService: ImagemService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarImagens();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  carregarImagens() {
    this.loading = true;
    this.imagemService.getImagensThumbnail().subscribe({
      next: (data: ImagemThumbnail[]) => {
        this.dataSource.data = data;
        this.loading = false;

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });

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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private customFilterPredicate() {
    return (data: ImagemThumbnail, filter: string): boolean => {
      const searchStr = `${data.id} ${data.nome}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  verImagemCompleta(imagem: ImagemThumbnail) {
    this.imagemService.getImagemCompleta(imagem.id).subscribe({
      next: (imagemCompleta) => {
        this.modalService.abrirImagem({
          id: imagemCompleta.id,
          nome: imagemCompleta.nome,
          imagem_base64: imagemCompleta.imagem_base64,
        });
      },
      error: (err) => {
        console.error('Erro ao carregar imagem completa:', err);
        this.toastService.error('Erro ao carregar imagem');
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
        this.toastService.error('Erro ao deletar imagem');
      },
    });
  }
}
