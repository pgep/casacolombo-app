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
    { valor: 'ajuste', label: '🔄 Ajuste Manual' },
  ];

  subtipoAjuste: 'entrada' | 'saida' = 'entrada';
  mostrarSubtipoAjuste: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private estoqueService: EstoqueService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarInsumos();
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
    // 1. VALIDAÇÕES BÁSICAS
    if (!this.movimentacao.insumo_id || this.movimentacao.insumo_id === 0) {
      this.toastService.warning('Selecione um insumo!');
      return;
    }

    if (!this.movimentacao.quantidade || this.movimentacao.quantidade <= 0) {
      this.toastService.warning('Quantidade deve ser maior que zero!');
      return;
    }

    const quantidade = Number(this.movimentacao.quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      this.toastService.warning('Quantidade inválida!');
      return;
    }

    // 2. PREPARAR DADOS
    this.loading = true;
    this.cdr.detectChanges();

    // Determina o tipo final da movimentação
    let tipoFinal: 'entrada' | 'saida' | 'ajuste' = this.movimentacao.tipo;

    // Se for ajuste, usa o subtipo escolhido (entrada ou saida)
    if (tipoFinal === 'ajuste') {
      tipoFinal = this.subtipoAjuste; // 'entrada' ou 'saida'
    }

    const dados = {
      insumo_id: Number(this.movimentacao.insumo_id),
      tipo: tipoFinal,
      quantidade: quantidade,
      motivo: this.movimentacao.motivo || this.getMotivoPadrao(tipoFinal),
    };

    // 3. ENVIAR
    this.estoqueService.registrarMovimentacao(dados).subscribe({
      next: () => {
        const mensagem = this.getMensagemSucesso(tipoFinal, quantidade);
        this.toastService.success(mensagem);
        this.router.navigate(['/estoque/movimentacoes']);
      },
      error: (err) => {
        console.error('Erro ao registrar movimentação:', err);
        this.toastService.error(err.error?.error || 'Erro ao registrar movimentação');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private getMotivoPadrao(tipo: string): string {
    const motivos = {
      entrada: 'Entrada registrada manualmente',
      saida: 'Saída registrada manualmente',
    };
    return motivos[tipo as keyof typeof motivos] || 'Movimentação registrada';
  }

  private getMensagemSucesso(tipo: string, quantidade: number): string {
    const mensagens = {
      entrada: `✅ Entrada de ${quantidade} unidades registrada com sucesso!`,
      saida: `➖ Saída de ${quantidade} unidades registrada com sucesso!`,
    };
    return mensagens[tipo as keyof typeof mensagens] || 'Movimentação registrada!';
  }
}
