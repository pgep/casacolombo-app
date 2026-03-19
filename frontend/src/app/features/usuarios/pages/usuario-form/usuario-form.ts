import { Component, OnInit, ChangeDetectorRef, ɵChangeDetectionScheduler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './usuario-form.html',
  styleUrl: './usuario-form.css',
})
export class UsuarioForm {
  usuario: Usuario = {
    nome: '',
    email: '',
    nivel: 'Selecione...',
    ativo: true,
  };
  niveis = ['Selecione...', 'admin', 'operador', 'visualizador'];
  editando = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioServico: UsuarioService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarUsuario(Number(id));
    }
  }

  carregarUsuario(id: Number) {
    this.loading = true;
    this.usuarioServico.getUsuario(Number(id)).subscribe({
      next: (data) => {
        ((this.usuario = data), (this.loading = false), this.cdr.detectChanges());
      },
      error: (err) => {
        this.loading = false;
        this.toastService.error('Erro ao carregar Usuario!', err);
        this.router.navigate(['/usuarios']);
      },
    });
  }

  salvarUsuario() {
    if (this.usuario.nivel == 'Selecione...') {
      this.toastService.info('Escolha um nível!');
      return;
    }

    if (!this.usuario.nome) {
      this.toastService.info('Nome do usuário é obrigatório!');
      return;
    }

    if (!this.usuario.email) {
      this.toastService.info('E-mail do usuário é obrigatório!');
      return;
    }

    this.loading = true;

    if (this.editando) {
      console.log(this.usuario);
      this.usuarioServico.updateUsuario(Number(this.usuario.id), this.usuario).subscribe({
        next: () => {
          this.toastService.success('Usuário atualizado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.log(err);
          this.toastService.error('Erro ao atualizar usuário !', err);
          this.loading = false;
        },
      });
    } else {
      this.usuarioServico.crieteUsuario(this.usuario).subscribe({
        next: () => {
          this.toastService.success('Usuário criado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          this.toastService.error('Erro ao criar usuário !', err);
          this.loading = false;
        },
      });
    }
  }
}
