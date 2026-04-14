import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsumoService } from '../../services/insumos';
import { UnidadeMedidaService } from '../../../unidade-medida/services/unidade-medida';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-insumo-form',
  standalone: true,
  templateUrl: './insumos-form.html',
  imports: [FormsModule, CommonModule, MatButtonModule, RouterModule],
})
export class InsumoFormComponent implements OnInit {
  insumo: any = {
    nome: '',
    unidade_medida_id: null,
    quantidade_compra: 0,
    valor_compra: 0,
    estoque_minimo: 0,
  };

  unidades: any[] = [];
  editando = false;
  loading = false;
  pendingRequests = 0;

  constructor(
    private insumoService: InsumoService,
    private unidadeService: UnidadeMedidaService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.startLoading();
    this.carregarUnidades();
    if (id) {
      this.editando = true;
      this.startLoading();
      this.carregarInsumos(Number(id));
    }
  }

  carregarUnidades() {
    this.unidadeService.getUnidades().subscribe({
      next: (u) => {
        this.unidades = u;
        this.stopLoading();
      },
      error: () => {
        this.toastService.error('Erro ao carregar unidades');
        this.stopLoading();
      },
    });
  }

  carregarInsumos(id: number) {
    this.insumoService.getInsumo(id).subscribe({
      next: (data: any) => {
        this.insumo = {
          id: data.id,
          nome: data.nome,
          unidade_medida_id: data.unidade_medida_id,
          quantidade_compra: data.quantidade_compra,
          valor_compra: data.valor_compra,
          quantidade_estoque: data.quantidade_estoque,
          estoque_minimo: data.estoque_minimo,
        };

        this.stopLoading();
      },
      error: () => {
        this.toastService.error('Erro ao carregar Insumos');
        this.router.navigate(['/insumo']);
        this.stopLoading();
      },
    });
  }

  salvar() {
    if (!this.insumo.nome || this.insumo.nome.trim() === '') {
      this.toastService.warning('Nome do insumo é obrigatório!');
      return;
    }

    if (!this.insumo.unidade_medida_id) {
      this.toastService.warning('Selecione uma unidade de medida!');
      return;
    }

    if (!this.insumo.quantidade_compra) {
      this.toastService.warning('Informe a quantidade comprada!');
      return;
    }

    if (!this.insumo.valor_compra) {
      this.toastService.warning('Informe o valor da compra!');
      return;
    }

    this.loading = true;

    if (this.editando) {
      this.insumoService.updateInsumo(this.insumo.id, this.insumo).subscribe({
        next: () => {
          this.toastService.success('Insumo atualizado com sucesso!');
          this.router.navigate(['/insumos']);
        },
        error: (err) => {
          this.errorHandler.tratarErro(err, 'Atualizar', 'Insumo');
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.insumoService.createInsumo(this.insumo).subscribe({
        next: () => {
          this.toastService.success('Insumo criado com sucesso!');
          this.router.navigate(['/insumos']);
        },
        error: (err) => {
          this.errorHandler.tratarErro(err, 'Criar', 'Insumo');
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  startLoading() {
    this.pendingRequests++;
    this.loading = true;
  }

  stopLoading() {
    this.pendingRequests--;

    if (this.pendingRequests <= 0) {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
