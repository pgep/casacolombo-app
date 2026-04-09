// frontend/src/app/features/estoque/pages/movimentacao-form/movimentacao-form.component.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { EstoqueService } from '../../services/estoque';
import { InsumoEstoque, AjusteEstoque } from '../../models/estoque.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-movimentacao-form',
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
  templateUrl: './movimentacao-form.html',
  styleUrls: ['./movimentacao-form.css'],
})
export class MovimentacaoFormComponent implements OnInit {
  insumos: InsumoEstoque[] = [];

  // ✅ TIPO EXPLÍCITO
  movimentacao: AjusteEstoque = {
    insumo_id: 0,
    tipo: 'entrada',
    quantidade: 0,
    motivo: '',
  };

  loading = false;
  carregandoInsumos = true;

  tipos: { valor: AjusteEstoque['tipo']; label: string }[] = [
    { valor: 'entrada', label: '➕ Entrada (Compra)' },
    { valor: 'saida', label: '➖ Saída (Uso)' },
    { valor: 'ajuste', label: '🔄 Ajuste Manual' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estoqueService: EstoqueService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarInsumos();

    // ✅ Capturar de diferentes formas (insumoId ou id)
    const insumoId = this.route.snapshot.paramMap.get('insumoId');
    const id = this.route.snapshot.paramMap.get('id');

    if (insumoId) {
      this.movimentacao.insumo_id = Number(insumoId);
    } else if (id) {
      this.movimentacao.insumo_id = Number(id);
    }
  }

  carregarInsumos() {
    this.carregandoInsumos = true;
    this.estoqueService.getInsumosEstoque().subscribe({
      next: (data) => {
        this.insumos = data;
        this.carregandoInsumos = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar insumos:', err);
        this.toastService.error('Erro ao carregar insumos');
        this.carregandoInsumos = false;
      },
    });
  }

  salvar() {
    // Validações
    if (!this.movimentacao.insumo_id || this.movimentacao.insumo_id === 0) {
      this.toastService.warning('Selecione um insumo!');
      return;
    }

    if (!this.movimentacao.quantidade || this.movimentacao.quantidade <= 0) {
      this.toastService.warning('Quantidade deve ser maior que zero!');
      return;
    }

    // ✅ Garantir que quantidade é número e não string
    const quantidade = Number(this.movimentacao.quantidade);

    if (isNaN(quantidade) || quantidade <= 0) {
      this.toastService.warning('Quantidade inválida!');
      return;
    }

    this.loading = true;
    this.cdr.detectChanges(); // ✅ Forçar detecção de mudanças

    // ✅ Preparar o objeto para enviar ao backend
    const dados = {
      insumo_id: Number(this.movimentacao.insumo_id),
      quantidade: quantidade,
      motivo: this.movimentacao.motivo || '',
    };

    // ✅ Chamada correta baseada no tipo
    if (this.movimentacao.tipo === 'entrada') {
      this.estoqueService.registrarEntrada(dados).subscribe({
        next: (response) => {
          this.toastService.success('Entrada registrada com sucesso!');
          this.router.navigate(['/estoque/movimentacoes']);
        },
        error: (err) => {
          console.error('Erro ao registrar entrada:', err);
          this.toastService.error(err.error?.error || 'Erro ao registrar entrada');
          this.loading = false;
          this.cdr.detectChanges(); // ✅ Forçar detecção
        },
      });
    } else if (this.movimentacao.tipo === 'saida') {
      this.estoqueService.registrarSaida(dados).subscribe({
        next: () => {
          this.toastService.success('Saída registrada com sucesso!');
          this.router.navigate(['/estoque/movimentacoes']);
        },
        error: (err) => {
          console.error('Erro ao registrar saída:', err);
          this.toastService.error(err.error?.error || 'Erro ao registrar saída');
          this.loading = false;
        },
      });
    } else {
      this.estoqueService
        .registrarAjuste({
          ...dados,
          tipo: this.movimentacao.tipo,
        })
        .subscribe({
          next: () => {
            this.toastService.success('Ajuste registrado com sucesso!');
            this.router.navigate(['/estoque/movimentacoes']);
          },
          error: (err) => {
            console.error('Erro ao registrar ajuste:', err);
            this.toastService.error(err.error?.error || 'Erro ao registrar ajuste');
            this.loading = false;
          },
        });
    }
  }
}
