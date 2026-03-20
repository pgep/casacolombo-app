import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService, Cliente } from '../../services/cliente';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
  ],
  templateUrl: './cliente-list.html',
  styleUrls: ['./cliente-list.css'],
})
export class ClienteListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'telefone', 'ativo', 'acoes'];
  dataSource = new MatTableDataSource<Cliente>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService,
  ) {}

  ngOnInit() {
    this.carregarClientes();

    // Configurar filtro personalizado (opcional)
    this.dataSource.filterPredicate = (data: Cliente, filter: string) => {
      const dataStr = `${data.id} ${data.nome} ${data.email} ${data.telefone}`.toLowerCase();
      return dataStr.includes(filter.toLowerCase());
    };
  }

  carregarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data: any[]) => {
        const clientes = data.map((item) => ({
          id: item.id,
          nome: item.nome || '',
          email: item.email || '',
          telefone: item.telefone || '',
          ativo: item.ativo === true || item.ativo === 'true',
          data_cadastro: item.data_cadastro || item.created_at,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));

        this.dataSource.data = clientes;

        // Conectar sort e paginator após os dados carregarem
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Erro ao carregar lista de clientes');
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
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este cliente?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmed) return;

    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        this.toastService.success('Cliente excluído com sucesso!');
        this.carregarClientes();
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar cliente');
      },
    });
  }
}
