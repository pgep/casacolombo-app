import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { Produto, Imagem } from '../../models/produto.model';

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
  
  tipos: any[] = [];
  imagens: Imagem[] = [];
  editando = false;
  loading = false;
  imagemPreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarDados();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarProduto(Number(id));
    }
  }

  carregarDados() {
    // Carrega tipos de produto para o select
    this.produtoService.getTiposProduto().subscribe({
      next: (data) => this.tipos = data,
      error: (err) => console.error('Erro ao carregar tipos:', err)
    });

    // Carrega imagens para o select
    this.produtoService.getImagens().subscribe({
      next: (data) => {
        this.imagens = data;
        console.log('Imagens carregadas:', this.imagens);
      },
      error: (err) => console.error('Erro ao carregar imagens:', err)
    });
  }

  carregarProduto(id: number) {
    this.loading = true;
    this.produtoService.getProduto(id).subscribe({
      next: (data) => {
        this.produto = data;
        
        // Se tiver imagem, carrega o preview
        if (data.imagem_base64) {
          this.imagemPreview = this.getBase64Image(data.imagem_base64);
        }
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err);
        this.loading = false;
        alert('Erro ao carregar produto');
        this.router.navigate(['/produtos']);
      }
    });
  }

  onImagemSelecionada(event: any) {
    const imagemId = Number(event.target.value);
    const imagem = this.imagens.find(i => i.id === imagemId);
    
    if (imagem) {
      this.imagemPreview = this.getBase64Image(imagem.imagem_base64);
    } else {
      this.imagemPreview = null;
    }
  }

  getBase64Image(base64: string): string {
    if (!base64) return '';
    return base64.startsWith('data:image') ? base64 : `data:image/jpeg;base64,${base64}`;
  }

  salvar() {
    if (!this.produto.nome || !this.produto.tipo_produto_id) {
      alert('Nome e Tipo são obrigatórios!');
      return;
    }

    // Se preco_final não foi preenchido, usa preco_venda
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
        error: (err) => {
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
        error: (err) => {
          console.error('Erro ao criar:', err);
          alert('Erro ao criar produto');
          this.loading = false;
        }
      });
    }
  }

  compararImagem(imagem1: any, imagem2: any): boolean {
    return imagem1 && imagem2 ? imagem1.id === imagem2.id : imagem1 === imagem2;
  }
}