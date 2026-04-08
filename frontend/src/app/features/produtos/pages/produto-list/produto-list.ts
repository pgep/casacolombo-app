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
import { ProdutoService } from '../../services/produto';
import { Produto } from '../../models/produto.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { ImagemService } from '../../../imagens/services/imagem';
import { ModalService } from '../../../../shared/services/modal.service';
import { MatDialog } from '@angular/material/dialog';
import { InsumosModalComponent } from '../../../../shared/components/insumos-modal/insumos-modal';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './produto-list.html',
  styleUrls: ['./produto-list.css'],
})
export class ProdutoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'tipo_nome', 'preco_final', 'ativo', 'acoes'];
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
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.carregarProdutos();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  carregarProdutos() {
    this.loading = true;
    this.produtoService.getProdutos().subscribe({
      next: (data: any) => {
        // ✅ CONVERTER OBJETO PARA ARRAY
        let produtosArray: Produto[] = [];

        if (Array.isArray(data)) {
          produtosArray = data;
        } else if (data && typeof data === 'object') {
          // Extrair apenas os produtos (ignorando 'insumos')
          produtosArray = Object.keys(data)
            .filter((key) => !isNaN(Number(key))) // só índices numéricos
            .map((key) => ({
              ...data[key],
              insumos: [], // insumos vêm de outra rota
            }));
        }

        this.dataSource.data = produtosArray;
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

  verInsumos(produto: Produto) {
    this.dialog.open(InsumosModalComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { produtoId: produto.id },
      panelClass: 'insumos-dialog',
      backdropClass: 'insumos-backdrop',
    });
  }
}
