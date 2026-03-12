import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { ImagemService } from '../../../imagens/services/imagem';  // ✅ OK
import { ModalService } from '../../../../shared/services/modal.service';  // ✅ OK
import { Produto } from '../../models/produto.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

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
    private imagemService: ImagemService,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService
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
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

verImagem(produto: Produto) {
  if (!produto.imagem_id) {
    this.toastService.info('Este produto não possui imagem');
    return;
  }
    
  // Desabilitar o botão temporariamente (opcional, mas bom)
  const botao = event?.target as HTMLElement;
  if (botao) {
    botao.setAttribute('disabled', 'true');
    setTimeout(() => botao.removeAttribute('disabled'), 1000);
  }
  
  this.imagemService.getImagemCompleta(produto.imagem_id).subscribe({
    next: (imagem) => {
      this.modalService.abrirImagem(imagem);
    },
    error: (err) => {
      this.toastService.error('Erro ao carregar imagem');
    }
  });
}

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusÃ£o',
      message: 'Tem certeza que deseja excluir este produto?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });

    if (!confirmed) return
    
    this.produtoService.deleteProduto(id).subscribe({
      next: () => {
        this.toastService.success('Produto excluido com sucesso!');
        this.carregarProdutos();
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar produto');
      }
    });
    
  }
}