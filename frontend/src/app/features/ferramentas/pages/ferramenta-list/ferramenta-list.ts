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
import { FerramentaService, Ferramenta } from '../../services/ferramenta';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-ferramenta-list',
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
    MatTooltipModule,
  ],
  templateUrl: './ferramenta-list.html',
  styleUrls: ['./ferramenta-list.css'],
})
export class FerramentaListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'unidademedida', 'quantidadeemestoque', 'acoes'];
  dataSource = new MatTableDataSource<Ferramenta>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private ferramentaService: FerramentaService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarFerramentas();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  carregarFerramentas() {
    this.loading = true;
    this.ferramentaService.getFerramentas().subscribe({
      next: (data: Ferramenta[]) => {
        this.dataSource.data = data;
        this.loading = false;

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Erro ao carregar ferramentas');
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
    return (data: Ferramenta, filter: string): boolean => {
      const searchStr =
        `${data.id} ${data.nome} ${data.unidadeMedida} ${data.quantidadeEmEstoque}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir esta ferramenta?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.ferramentaService.deleteFerramenta(id).subscribe({
      next: () => {
        this.toastService.success('Ferramenta excluída com sucesso!');
        this.carregarFerramentas();
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar ferramenta');
      },
    });
  }
}
