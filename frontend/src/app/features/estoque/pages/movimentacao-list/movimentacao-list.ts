// frontend/src/app/features/estoque/pages/movimentacao-list/movimentacao-list.ts

import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { EstoqueService } from '../../services/estoque';
import { MovimentacaoEstoque } from '../../models/estoque.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-movimentacao-list',
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
  templateUrl: './movimentacao-list.html',
  styleUrls: ['./movimentacao-list.css'],
})
export class MovimentacaoListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    'id',
    'created_at',
    'insumo_nome',
    'tipo',
    'quantidade',
    'quantidade_antes',
    'quantidade_depois',
    'motivo',
  ];
  dataSource = new MatTableDataSource<MovimentacaoEstoque>([]);
  loading = true;
  insumoId: number | null = null;
  insumoNome: string = '';
  private subscription: any = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private estoqueService: EstoqueService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.insumoId = this.route.snapshot.paramMap.get('insumoId')
      ? Number(this.route.snapshot.paramMap.get('insumoId'))
      : null;
    this.carregarMovimentacoes();
  }

  ngAfterViewInit() {
    this.configurarSortEPaginator();
  }

  ngOnDestroy() {
    // Limpar subscription se existir
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  configurarSortEPaginator() {
    if (this.sort && this.paginator && this.dataSource.data.length > 0) {
      setTimeout(() => {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
      });
    }
  }

  carregarMovimentacoes() {
    // Garantir que loading começa como true
    this.loading = true;
    this.cdr.detectChanges();

    // Usar finalize para garantir que loading sempre volta para false
    this.subscription = this.estoqueService
      .getMovimentacoes(this.insumoId || undefined)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          // Garantir que data é um array
          const dados = data || [];
          this.dataSource.data = dados;

          if (dados.length > 0 && this.insumoId) {
            this.insumoNome = dados[0].insumo_nome;
          } else {
            this.insumoNome = '';
          }

          if (dados.length > 0) {
            this.configurarSortEPaginator();
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('❌ Erro ao carregar movimentações:', err);
          this.toastService.error('Erro ao carregar histórico');
          this.dataSource.data = [];
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

  getTipoLabel(tipo: string): string {
    const tipos: Record<string, string> = {
      entrada: '➕ Entrada',
      saida: '➖ Saída',
      ajuste: '🔄 Ajuste',
    };
    return tipos[tipo] || tipo;
  }

  getTipoClass(tipo: string): string {
    const classes: Record<string, string> = {
      entrada: 'tipo-entrada',
      saida: 'tipo-saida',
      ajuste: 'tipo-ajuste',
    };
    return classes[tipo] || '';
  }
}
