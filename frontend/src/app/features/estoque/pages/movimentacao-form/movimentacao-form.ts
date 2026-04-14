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
  unidadeSelecionada: string = '';
  unidadePlaceholder: string = '';

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
        console.log(data);
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

    // ✅ OBTER O FATOR DE CONVERSÃO DO INSUMO SELECIONADO
    const insumo = this.insumos.find((i) => i.id === this.movimentacao.insumo_id);
    const fatorConversao = insumo?.fator_conversao || 1;

    // ✅ CONVERTER PARA UNIDADE BASE (ml, g, un)
    const quantidadeBase = quantidade * fatorConversao;

    console.log(
      `🔄 Conversão: ${quantidade} ${insumo?.unidade_medida_nome} = ${quantidadeBase} (unidade base)`,
    );

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
      quantidade: quantidadeBase,
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

  onInsumoChange(insumoId: number | string) {
    // ✅ Converter para número (forçar tipo correto)
    const id = Number(insumoId);

    console.log('ID original:', insumoId, 'Tipo:', typeof insumoId);
    console.log('ID convertido:', id, 'Tipo:', typeof id);
    console.log('Insumos disponíveis:', this.insumos);

    // Validar se ID é válido
    if (!id || id === 0) {
      this.unidadeSelecionada = '';
      this.unidadePlaceholder = 'Digite a quantidade';
      return;
    }

    // Aguardar insumos carregarem
    if (!this.insumos || this.insumos.length === 0) {
      console.warn('Insumos ainda não carregados');
      return;
    }

    // ✅ Buscar comparando como número
    const insumo = this.insumos.find((i) => Number(i.id) === id);

    if (insumo) {
      this.unidadeSelecionada = insumo.unidade_medida_nome || '';
      this.unidadePlaceholder = `Digite a quantidade em ${this.unidadeSelecionada}`;
      console.log('✅ Insumo encontrado:', insumo.nome, 'Unidade:', this.unidadeSelecionada);
    } else {
      console.error('❌ Insumo não encontrado para ID:', id);
      console.log(
        'IDs disponíveis:',
        this.insumos.map((i) => ({ id: i.id, tipo: typeof i.id })),
      );
    }
  }
}
