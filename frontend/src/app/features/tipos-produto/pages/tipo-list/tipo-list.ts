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
import { TipoProdutoService, TipoProduto } from '../../services/tipo-produto';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-tipo-list',
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
  templateUrl: './tipo-list.html',
  styleUrls: ['./tipo-list.css'],
})
export class TipoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'ativo', 'acoes'];
  dataSource = new MatTableDataSource<TipoProduto>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private tipoService: TipoProdutoService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarTipos();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  carregarTipos() {
    this.loading = true;
    this.tipoService.getTodos().subscribe({
      next: (data: any[]) => {
        const tipos = data.map((item) => ({
          id: item.id,
          nome: item.nome || '',
          ativo: item.ativo === true || item.ativo === 'true',
          data_cadastro: item.data_cadastro,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        this.dataSource.data = tipos;
        this.loading = false;

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('❌ Erro ao carregar tipos de produto');
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
    return (data: TipoProduto, filter: string): boolean => {
      const searchStr = `${data.id} ${data.nome}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este Tipo Produto?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.tipoService.deleteTipo(id).subscribe({
      next: () => {
        this.toastService.success('Tipo Produto excluído com sucesso!');
        this.carregarTipos();
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar Tipo de Produto');
      },
    });
  }
}
