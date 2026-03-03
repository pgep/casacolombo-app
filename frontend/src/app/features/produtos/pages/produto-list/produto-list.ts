import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutoService, Produto } from '../../services/produto';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './produto-list.html',
  styleUrls: ['./produto-list.css']
})
export class ProdutoListComponent implements OnInit {
  produtos: Produto[] = [];
  loading = true;

  constructor(
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.loading = true;
    this.produtoService.getProdutos().subscribe({
      next: (data) => {
        this.produtos = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.deleteProduto(id).subscribe({
        next: () => this.carregarProdutos(),
        error: (err) => {
          console.error('Erro ao deletar:', err);
          alert('Erro ao deletar produto');
        }
      });
    }
  }
}