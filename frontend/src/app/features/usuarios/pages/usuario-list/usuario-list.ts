import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './usuario-list.html',
  styleUrl: './usuario-list.css',
})
export class UsuarioList implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService,
  ) {}

  ngOnInit() {
    this.selecionarTodos();
  }

  selecionarTodos() {
    this.loading = true;
    this.usuarioService.getTodos().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Erro ao carregar os usuários !');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  async deletarUsuario(id: Number) {
    const confirmado = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este usuário?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
    });
    if (!confirmado) return;
    this.usuarioService.deleteUsuario(id).subscribe({
      next: () => {
        this.toastService.success('Tipo excluído com sucesso!');
        this.selecionarTodos();
      },
      error: (err) => {
        this.toastService.error('Ero ao excluir usuário', err);
      },
    });
  }
}
