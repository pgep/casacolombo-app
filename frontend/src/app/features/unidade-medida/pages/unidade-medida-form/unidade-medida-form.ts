import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnidadeMedidaService, UnidadeMedida } from '../../services/unidade-medida';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../../shared/services/toast.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';

@Component({
  selector: 'app-unidade-medida-form',
  standalone: true,
  imports: [FormsModule, CommonModule, MatButtonModule, RouterLink],
  templateUrl: './unidade-medida-form.html',
})
export class UnidadeMedidaFormComponent implements OnInit {
  unidade: UnidadeMedida = {
    nome: '',
    tipo: '',
    fator_conversao: 0,
  };

  editando = false;
  loading = false;

  constructor(
    private unidadeMedida: UnidadeMedidaService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarUnidade(Number(id));
    }
  }

  carregarUnidade(id: number) {
    this.loading = true;
    this.unidadeMedida.getUnidade(id).subscribe({
      next: (data: any) => {
        this.unidade = {
          id: data.id,
          nome: data.nome || '',
          tipo: data.tipo,
          fator_conversao: data.fator_conversao || '',
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.toastService.error('Erro ao carregar Unidade de Medida');
        this.router.navigate(['/unidade-medida']);
      },
    });
  }

  salvar() {
    if (!this.unidade.nome) {
      this.toastService.error('Nome é obrigatório !');
      return;
    } else if (!this.unidade.tipo) {
      this.toastService.error('Selecione um tipo');
      return;
    } else if (!this.unidade.fator_conversao) {
      this.toastService.error('Fator de conversão é obrigatório!');
      return;
    }
    this.loading = true;

    if (this.editando) {
      this.unidadeMedida.updateUnidade(this.unidade.id!, this.unidade).subscribe({
        next: () => {
          this.toastService.success('Tipo Unidade salna com sucesso!');
          this.router.navigate(['/unidade-medida']);
        },
        error: (err) => {
          this.errorHandler.tratarErro(err, 'Atualizar', 'Ferramenta');
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.unidadeMedida.createUnidade(this.unidade).subscribe({
        next: () => {
          this.toastService.success('Unidade de medida criada com sucesso!');
          this.router.navigate(['/unidade-medida']);
        },
        error: (err) => {
          this.errorHandler.tratarErro(err, 'Criar', 'Unidade de Medida');
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }
}
