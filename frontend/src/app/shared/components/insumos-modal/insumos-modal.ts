import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProdutoService } from '../../../features/produtos/services/produto';

export interface InsumoItem {
  nome: string;
  quantidade: number;
  custo_unitario: number;
  subtotal: number;
}

@Component({
  selector: 'app-insumos-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './insumos-modal.html',
  styleUrls: ['./insumos-modal.css'],
})
export class InsumosModalComponent implements OnInit {
  insumos: InsumoItem[] = [];
  carregando = true;
  custoTotal = 0;

  constructor(
    private dialogRef: MatDialogRef<InsumosModalComponent>,
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { produtoId: number },
  ) {
    console.log('🏗️ Construtor do InsumosModalComponent chamado!');
    console.log('📦 Data recebida:', this.data);
  }

  ngOnInit() {
    console.log('🔄 ngOnInit do InsumosModalComponent');
    this.cdr.detach();

    if (this.data?.produtoId) {
      console.log('🔍 Carregando insumos para produto:', this.data.produtoId);
      this.carregarInsumos(this.data.produtoId);
    } else {
      console.warn('⚠️ Nenhum produtoId recebido!');
    }
  }

  carregarInsumos(produtoId: number) {
    this.produtoService.getInsumosByProduto(produtoId).subscribe({
      next: (data: any[]) => {
        this.insumos = data.map((item) => ({
          nome: item.nome || 'Insumo não identificado',
          quantidade: Number(item.quantidade) || 0,
          custo_unitario: Number(item.custo_unitario) || 0,
          subtotal: (Number(item.quantidade) || 0) * (Number(item.custo_unitario) || 0),
        }));
        this.custoTotal = this.insumos.reduce((sum, item) => sum + item.subtotal, 0);
        this.carregando = false;

        // ✅ RECONECTAR E FORÇAR ATUALIZAÇÃO
        this.cdr.reattach();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar insumos:', err);
        this.carregando = false;
        this.cdr.reattach();
        this.cdr.detectChanges();
      },
    });
  }

  fechar() {
    this.dialogRef.close();
  }
}
