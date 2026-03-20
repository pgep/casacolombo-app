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
import { TipoInsumoService } from '../../services/tipo-insumo';
import { TipoInsumo } from '../../models/tipo-insumo.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-tipo-insumo-list',
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
  templateUrl: './tipo-insumo-list.html',
  styleUrls: ['./tipo-insumo-list.css'],
})
export class TipoInsumoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'ativo', 'acoes'];
  dataSource = new MatTableDataSource<TipoInsumo>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private tipoInsumoService: TipoInsumoService,
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
    this.tipoInsumoService.getTodos().subscribe({
      next: (data: TipoInsumo[]) => {
        this.dataSource.data = data;
        this.loading = false;

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Erro ao carregar tipos de insumo');
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
    return (data: TipoInsumo, filter: string): boolean => {
      const searchStr = `${data.id} ${data.nome}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este tipo de insumo?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.tipoInsumoService.deleteTipo(id).subscribe({
      next: () => {
        this.toastService.success('Tipo de insumo excluído com sucesso!');
        this.carregarTipos();
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        this.toastService.error('Erro ao deletar tipo de insumo');
      },
    });
  }
}
