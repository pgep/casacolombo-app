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
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-usuario-list',
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
  templateUrl: './usuario-list.html',
  styleUrls: ['./usuario-list.css'],
})
export class UsuarioList implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'email', 'nivel', 'ativo', 'acoes'];
  dataSource = new MatTableDataSource<Usuario>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usuarioService: UsuarioService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
    this.dataSource.filterPredicate = this.customFilterPredicate();
  }

  carregarUsuarios() {
    this.loading = true;
    this.usuarioService.getTodos().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Erro ao carregar usuários!');
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
    return (data: Usuario, filter: string): boolean => {
      const searchStr = `${data.id} ${data.nome} ${data.email} ${data.nivel}`.toLowerCase();
      return searchStr.includes(filter);
    };
  }

  async deletarUsuario(id: number) {
    const confirmado = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este usuário?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });

    if (!confirmado) return;

    this.usuarioService.deleteUsuario(id).subscribe({
      next: () => {
        this.toastService.success('Usuário excluído com sucesso!');
        this.carregarUsuarios();
      },
      error: (err) => {
        this.toastService.error('Erro ao excluir usuário');
      },
    });
  }
}
