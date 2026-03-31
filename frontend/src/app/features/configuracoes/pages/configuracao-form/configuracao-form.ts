import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfiguracaoService } from '../../services/configuracao';
import { Configuracao } from '../../models/configuracao.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';

@Component({
  selector: 'app-configuracao-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
  ],
  templateUrl: './configuracao-form.html',
  styleUrls: ['./configuracao-form.css'],
})
export class ConfiguracaoFormComponent implements OnInit {
  config: Configuracao = {
    chave: '',
    valor: '',
    descricao: '',
    ativo: true,
  };
  editando = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configuracaoService: ConfiguracaoService,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarConfiguracao(Number(id));
    }
  }

  carregarConfiguracao(id: number) {
    this.loading = true;
    this.configuracaoService.getConfiguracao(id).subscribe({
      next: (data: Configuracao) => {
        this.config = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar configuração:', err);
        this.toastService.error('Erro ao carregar configuração');
        this.loading = false;
        this.router.navigate(['/configuracoes']);
      },
    });
  }

  salvar() {
    // Validações
    if (!this.config.chave?.trim()) {
      this.toastService.warning('Chave é obrigatória!');
      return;
    }
    if (!this.config.valor?.trim()) {
      this.toastService.warning('Valor é obrigatório!');
      return;
    }

    this.loading = true;

    if (this.editando) {
      this.configuracaoService.updateConfiguracao(this.config.id!, this.config).subscribe({
        next: () => {
          this.toastService.success('Configuração atualizada com sucesso!');
          this.router.navigate(['/configuracoes']);
        },
        error: (err) => {
          this.errorHandler.tratarErro(err, 'atualizar', 'configuração');
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.configuracaoService.createConfiguracao(this.config).subscribe({
        next: () => {
          this.toastService.success('Configuração criada com sucesso!');
          this.router.navigate(['/configuracoes']);
        },
        error: (err) => {
          this.errorHandler.tratarErro(err, 'criar', 'configuração');
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }
}
