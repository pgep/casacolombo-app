// frontend/src/app/features/estoque/pages/estoque-list/estoque-list.ts

import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { EstoqueService } from '../../services/estoque';
import { InsumoEstoque } from '../../models/estoque.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-estoque-list',
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
  ],
  templateUrl: './estoque-list.html',
  styleUrls: ['./estoque-list.css'],
})
export class EstoqueListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nome', 'estoque_atual', 'estoque_minimo', 'status', 'acoes'];
  dataSource = new MatTableDataSource<InsumoEstoque>([]);
  loading = true;
  alertas: InsumoEstoque[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private estoqueService: EstoqueService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.carregarEstoque();
    this.carregarAlertas();
  }

  ngAfterViewInit() {
    // Configurar sort e paginator após a view ser inicializada
    setTimeout(() => {
      if (this.dataSource) {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }
    });
  }

  carregarEstoque() {
    this.loading = true;
    this.cdr.detectChanges(); // ✅ Forçar detecção imediatamente

    this.estoqueService.getInsumosEstoque().subscribe({
      next: (data) => {
        console.log('dados de retorno: ', data);
        this.dataSource.data = data.map((item) => ({
          ...item,
          status: this.calcularStatus(item.estoque_atual, item.estoque_minimo),
        }));
        this.loading = false;

        // ✅ Configurar sort e paginator depois que os dados chegaram
        if (this.sort && this.paginator) {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }

        this.cdr.detectChanges(); // ✅ Forçar detecção após mudanças
      },
      error: (err) => {
        console.error('Erro ao carregar estoque:', err);
        this.toastService.error('Erro ao carregar estoque');
        this.loading = false;
        this.cdr.detectChanges(); // ✅ Forçar detecção após erro
      },
    });
  }

  carregarAlertas() {
    this.estoqueService.getAlertasEstoqueBaixo().subscribe({
      next: (data) => {
        this.alertas = data;
        if (this.alertas.length > 0) {
          this.toastService.warning(`${this.alertas.length} insumo(s) com estoque baixo!`);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar alertas:', err);
        this.cdr.detectChanges();
      },
    });
  }

  calcularStatus(estoque: number, minimo: number): 'ok' | 'baixo' | 'critico' {
    if (estoque <= 0) return 'critico';
    if (estoque <= minimo) return 'baixo';
    return 'ok';
  }

  verMovimentacoes(insumoId: number) {
    this.router.navigate(['/estoque/movimentacoes', insumoId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
