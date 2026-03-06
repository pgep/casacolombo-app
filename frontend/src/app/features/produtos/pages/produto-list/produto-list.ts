import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { ImagemService } from '../../../imagens/services/imagem';  // ✅ OK
import { ModalService } from '../../../../shared/services/modal.service';  // ✅ OK
import { Produto } from '../../models/produto.model';
import { ImagemCompleta } from '../../../imagens/services/imagem';  // ← IMPORTAR O TIPO

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

  // Controle para evitar múltiplos cliques
  private imagemCarregando = false;

  constructor(
    private produtoService: ProdutoService,
    private imagemService: ImagemService,  // ← ADICIONADO
    private modalService: ModalService,    // ← ADICIONADO
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

verImagem(produto: Produto) {
  if (!produto.imagem_id) {
    alert('Este produto não possui imagem');
    return;
  }
  
  console.log('🔍 Ver imagem clicado para produto:', produto.nome, 'ID imagem:', produto.imagem_id);
  
  // Desabilitar o botão temporariamente (opcional, mas bom)
  const botao = event?.target as HTMLElement;
  if (botao) {
    botao.setAttribute('disabled', 'true');
    setTimeout(() => botao.removeAttribute('disabled'), 1000);
  }
  
  this.imagemService.getImagemCompleta(produto.imagem_id).subscribe({
    next: (imagem) => {
      console.log('✅ Imagem carregada, chamando modal');
      this.modalService.abrirImagem(imagem);
    },
    error: (err) => {
      console.error('❌ Erro ao carregar imagem:', err);
      alert('Erro ao carregar imagem');
    }
  });
}

  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.produtoService.deleteProduto(id).subscribe({
        next: () => {
          console.log('🗑️ Produto deletado');
          this.carregarProdutos();
        },
        error: (err) => {
          console.error('❌ Erro ao deletar:', err);
          alert('Erro ao deletar produto');
        }
      });
    }
  }
}