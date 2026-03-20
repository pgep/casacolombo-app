import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ProdutoService, Produto } from '../../services/produto';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { ImagemService } from '../../../imagens/services/imagem';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './produto-list.html',
  styleUrls: ['./produto-list.css'],
})
export class ProdutoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'tipo', 'preco', 'ativo', 'acoes'];
  dataSource = new MatTableDataSource<Produto>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private produtoService: ProdutoService,
    private imagemService: ImagemService,
    private modalService: ModalService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarProdutos();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  carregarProdutos() {
    this.loading = true;
    this.produtoService.getProdutos().subscribe({
      next: (data: Produto[]) => {
        this.dataSource.data = data;
        this.loading = false;

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Erro ao carregar produtos');
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
    return (data: Produto, filter: string): boolean => {
      const searchStr =
        `${data.id} ${data.nome} ${data.tipo_nome} ${data.preco_venda}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  verImagem(produto: Produto) {
    if (!produto.imagem_id) return;

    this.imagemService.getImagemCompleta(produto.imagem_id).subscribe({
      next: (imagem) => this.modalService.abrirImagem(imagem),
      error: (err) => {
        console.error('Erro ao carregar imagem:', err);
        this.toastService.error('Erro ao carregar imagem');
      },
    });
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este produto?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.produtoService.deleteProduto(id).subscribe({
      next: () => {
        this.toastService.success('Produto excluído com sucesso!');
        this.carregarProdutos();
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar produto');
      },
    });
  }
}
