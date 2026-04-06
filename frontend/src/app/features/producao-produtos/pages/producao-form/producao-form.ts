// frontend/src/app/features/producao-produtos/pages/producao-form/producao-form.component.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProducaoService } from '../../services/producao-produto';
import { Producao } from '../../models/producao.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';

@Component({
  selector: 'app-producao-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './producao-form.html',
  styleUrls: ['./producao-form.css'],
})
export class ProducaoFormComponent implements OnInit {
  producao: Producao = {
    produto_id: 0,
    quantidade_produzida: 0,
    quantidade_disponivel: 0,
    custo_total_producao: 0,
    custo_unitario_producao: 0,
    observacao: '',
  };
  produtos: any[] = [];
  editando = false;
  loading = false;
  carregandoProdutos = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private producaoService: ProducaoService,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarProdutos();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarProducao(Number(id));
    }
  }

  custoUnitarioProduto: number = 0;

  carregarProdutos() {
    this.carregandoProdutos = true;
    this.producaoService.getProdutosParaSelect().subscribe({
      next: (data) => {
        this.produtos = data;
        this.carregandoProdutos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.toastService.error('Erro ao carregar produtos');
        this.carregandoProdutos = false;
      },
    });
  }

  carregarProducao(id: number) {
    this.loading = true;
    this.producaoService.getProducao(id).subscribe({
      next: (data: Producao) => {
        this.producao = data;
        // ✅ Armazenar o custo unitário original do produto
        this.custoUnitarioProduto = data.custo_unitario_producao;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produção:', err);
        this.toastService.error('Erro ao carregar produção');
        this.loading = false;
        this.router.navigate(['/producao-produtos']);
      },
    });
  }

  salvar() {
    if (!this.producao.produto_id) {
      this.toastService.warning('Selecione um produto!');
      return;
    }
    if (!this.producao.quantidade_produzida || this.producao.quantidade_produzida <= 0) {
      this.toastService.warning('Quantidade produzida deve ser maior que zero!');
      return;
    }

    this.loading = true;

    const request = this.editando
      ? this.producaoService.updateProducao(this.producao.id!, this.producao)
      : this.producaoService.createProducao(this.producao);

    request.subscribe({
      next: () => {
        this.toastService.success(
          this.editando ? 'Produção atualizada com sucesso!' : 'Produção registrada com sucesso!',
        );
        this.router.navigate(['/producao-produtos']);
      },
      error: (err) => {
        this.errorHandler.tratarErro(err, 'salvar', 'produção');
        this.loading = false;
      },
    });
  }

  recalcular() {
    const qtd = this.producao.quantidade_produzida || 0;
    const custoUnitario = this.custoUnitarioProduto;

    if (qtd > 0 && custoUnitario > 0) {
      this.producao.custo_total_producao = qtd * custoUnitario;
      this.producao.custo_unitario_producao = custoUnitario;
      this.producao.quantidade_disponivel = qtd;
    } else {
      this.producao.custo_total_producao = 0;
      this.producao.custo_unitario_producao = 0;
      this.producao.quantidade_disponivel = qtd;
    }

    this.cdr.detectChanges();
  }
}
