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
import { ConfiguracaoService } from '../../services/configuracao';
import { Configuracao } from '../../models/configuracao.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-configuracao-list',
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
  templateUrl: './configuracao-list.html',
  styleUrls: ['./configuracao-list.css'],
})
export class ConfiguracaoListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'chave', 'valor', 'descricao', 'ativo', 'acoes'];
  dataSource = new MatTableDataSource<Configuracao>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private configuracaoService: ConfiguracaoService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarConfiguracoes();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  carregarConfiguracoes() {
    this.loading = true;
    this.configuracaoService.getConfiguracoes().subscribe({
      next: (data: Configuracao[]) => {
        this.dataSource.data = data;
        this.loading = false;

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar configurações:', err);
        this.toastService.error('Erro ao carregar configurações');
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
    return (data: Configuracao, filter: string): boolean => {
      const searchStr = `${data.id} ${data.chave} ${data.valor} ${data.descricao}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir esta configuração?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.configuracaoService.deleteConfiguracao(id).subscribe({
      next: () => {
        this.toastService.success('Configuração excluída com sucesso!');
        this.carregarConfiguracoes();
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        this.toastService.error('Erro ao deletar configuração');
      },
    });
  }
}
