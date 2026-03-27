import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { UnidadeMedidaService, UnidadeMedida } from '../../services/unidade-medida';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';

@Component({
  selector: 'app-unidade-medida-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, // 👈 AQUI
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    RouterModule,
  ],
  templateUrl: './unidade-medida-list.html',
})
export class UnidadeMedidaListComponent implements OnInit {
  displayedColumns = ['id', 'nome', 'tipo', 'fator_conversao', 'acoes'];
  dataSource = new MatTableDataSource<UnidadeMedida>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private unidadeMedidaService: UnidadeMedidaService,
    private confirmService: ConfirmService,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.loading = true;
    this.unidadeMedidaService.getUnidades().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.loading = false;
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
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir esta Unidade de medida?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.unidadeMedidaService.deleteUnidade(id).subscribe({
      next: () => {
        this.toastService.success('Unidade de medida excluída com sucesso!');
        this.carregar();
      },
      error: (err) => {
        this.errorHandler.tratarErro(err, 'Exclisão', 'Unidade de medida');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
