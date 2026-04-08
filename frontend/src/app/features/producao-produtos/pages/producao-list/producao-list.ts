// frontend/src/app/features/producao-produtos/pages/producao-list/producao-list.component.ts

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
import { MatDialogModule } from '@angular/material/dialog';
import { ProducaoService } from '../../services/producao-produto';
import { Producao } from '../../models/producao.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-producao-list',
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
  templateUrl: './producao-list.html',
  styleUrls: ['./producao-list.css'],
})
export class ProducaoListComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'produto_nome',
    'quantidade_produzida',
    'quantidade_disponivel',
    'custo_total_producao',
    'custo_unitario_producao',
    'data_producao',
    'acoes',
  ];
  dataSource = new MatTableDataSource<Producao>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private producaoService: ProducaoService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarProducoes();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  carregarProducoes() {
    this.loading = true;
    this.producaoService.getProducoes().subscribe({
      next: (data: Producao[]) => {
        this.dataSource.data = data;
        this.loading = false;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produções:', err);
        this.toastService.error('Erro ao carregar produções');
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
    return (data: Producao, filter: string): boolean => {
      const searchStr = `${data.id} ${data.produto_nome}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir esta produção?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.producaoService.deleteProducao(id).subscribe({
      next: () => {
        this.toastService.success('Produção excluída com sucesso!');
        this.carregarProducoes();
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        this.toastService.error('Erro ao deletar produção');
      },
    });
  }
}
