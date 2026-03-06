import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { ImagemService } from '../../../imagens/services/imagem';
import { Produto } from '../../models/produto.model';

export interface TipoProduto {
  id: number;
  nome: string;
}

export interface ImagemSelect {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './produto-form.html',
  styleUrls: ['./produto-form.css']
})
export class ProdutoFormComponent implements OnInit {
  produto: Produto = {
    nome: '',
    descricao: '',
    tipo_produto_id: 0,
    imagem_id: undefined,
    custo_total: 0,
    preco_venda: 0,
    preco_final: 0,
    ativo: true
  };
  
  tipos: TipoProduto[] = [];
  imagensSelect: ImagemSelect[] = [];
  editando = false;
  loading = false;
  
  // 🔥 NOVA PROPRIEDADE PARA O PREVIEW
  imagemPreview: string | null = null;  // ← ADICIONADO

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private imagemService: ImagemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarTipos();
    this.carregarImagensParaSelect();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarProduto(Number(id));
    }
  }

  carregarTipos() {
    this.produtoService.getTiposProduto().subscribe({
      next: (data: TipoProduto[]) => {
        this.tipos = data;
      },
      error: (err: any) => {
        console.error('Erro ao carregar tipos:', err);
      }
    });
  }

  carregarImagensParaSelect() {
    this.imagemService.getImagensParaSelect().subscribe({
      next: (data: ImagemSelect[]) => {
        this.imagensSelect = data;
        console.log('Imagens carregadas:', this.imagensSelect);
      },
      error: (err: any) => {
        console.error('Erro ao carregar imagens:', err);
      }
    });
  }

  carregarProduto(id: number) {
    this.loading = true;
    this.produtoService.getProduto(id).subscribe({
      next: (data: Produto) => {
        this.produto = data;
        
        // Se o produto já tem uma imagem, carregar o preview
        if (data.imagem_id) {
          this.carregarPreviewImagem(data.imagem_id);
        }
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar produto:', err);
        this.loading = false;
        alert('Erro ao carregar produto');
        this.router.navigate(['/produtos']);
      }
    });
  }

  // 🔥 NOVO MÉTODO PARA CARREGAR PREVIEW DA IMAGEM
  carregarPreviewImagem(imagemId: number) {
    this.imagemService.getImagemCompleta(imagemId).subscribe({
      next: (imagem) => {
        this.imagemPreview = imagem.imagem_base64.startsWith('data:image')
          ? imagem.imagem_base64
          : `data:image/jpeg;base64,${imagem.imagem_base64}`;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar preview da imagem:', err);
      }
    });
  }

  // 🔥 MÉTODO PARA QUANDO SELECIONAR UMA IMAGEM NO SELECT
  onImagemSelecionada(event: any) {
    const imagemId = Number(event.target.value);
    if (imagemId) {
      this.carregarPreviewImagem(imagemId);
    } else {
      this.imagemPreview = null;
    }
  }

  salvar() {
    if (!this.produto.nome || !this.produto.tipo_produto_id) {
      alert('Nome e Tipo são obrigatórios!');
      return;
    }

    if (!this.produto.preco_final) {
      this.produto.preco_final = this.produto.preco_venda;
    }

    this.loading = true;

    if (this.editando) {
      this.produtoService.updateProduto(this.produto.id!, this.produto).subscribe({
        next: () => {
          alert('Produto atualizado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: (err: any) => {
          console.error('Erro ao atualizar:', err);
          alert('Erro ao atualizar produto');
          this.loading = false;
        }
      });
    } else {
      this.produtoService.createProduto(this.produto).subscribe({
        next: () => {
          alert('Produto criado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: (err: any) => {
          console.error('Erro ao criar:', err);
          alert('Erro ao criar produto');
          this.loading = false;
        }
      });
    }
  }
}