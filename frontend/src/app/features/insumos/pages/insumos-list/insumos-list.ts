import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { InsumoService } from '../../services/insumos';
import { Insumo } from '../../models/insumos.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-insumo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './insumos-list.html',
})
export class InsumoListComponent implements OnInit {
  displayedColumns = ['nome', 'unidade', 'estoque', 'custo', 'acoes'];
  dataSource = new MatTableDataSource<Insumo>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: InsumoService,
    private toastService: ToastService,
    private confirm: ConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarInsumo();
  }

  carregarInsumo() {
    this.service.getInsumos().subscribe({
      next: (data) => {
        this.dataSource.data = data;

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastService.error('Erro ao carregar insumos');
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

  async deletar(id: number) {
    const ok = await this.confirm.confirm({
      title: 'Excluir',
      message: 'Deseja excluir este insumo?',
    });

    if (!ok) return;

    this.service.deleteInsumo(id).subscribe(() => {
      this.toastService.success('Insumo excluído com sucesso!-');
      this.carregarInsumo();
    });
  }
}
