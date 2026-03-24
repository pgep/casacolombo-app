import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { ImagemService } from '../../../imagens/services/imagem';
import { Produto } from '../../models/produto.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { MatButtonModule } from '@angular/material/button';

export interface TipoProduto {
  id: number;
  nome: string;
}

export interface ImagemSelect {
  id: number;
  nome: string;
}

function validaDadosEmBranco(p: Produto): string | false {
  if (p.custo_total == 0) return 'Insira o valor do custo total!';
  if (p.preco_final == 0) return 'Insira o valor do preço final!';
  if (p.preco_venda == 0) return 'Insira o valor do preço de venda!';
  if (p.descricao == '') return 'Insira uma descrição!';
  if (p.nome == '') return 'O nome é obrigatório!';
  if (p.tipo_produto_id == 0) return 'Tipo produto obrigatório!';
  if (p.imagem_id == undefined) return 'Selecione uma imagem!';

  return false;
}

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule],
  templateUrl: './produto-form.html',
  styleUrls: ['./produto-form.css'],
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
    ativo: true,
  };

  tipos: TipoProduto[] = [];
  imagensSelect: ImagemSelect[] = [];
  editando = false;
  loading = false;

  // ✅ NOVAS PROPRIEDADES PARA LOADING DOS SELECTS
  carregandoTipos = true;
  carregandoImagens = true;

  imagemPreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private imagemService: ImagemService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    // Carregar tipos e imagens em paralelo
    Promise.all([this.carregarTipos(), this.carregarImagensParaSelect()]).then(() => {
      console.log('✅ Dados auxiliares carregados');
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarProduto(Number(id));
    }
  }

  carregarTipos(): Promise<void> {
    this.carregandoTipos = true;
    return new Promise((resolve) => {
      this.produtoService.getTiposProduto().subscribe({
        next: (data: TipoProduto[]) => {
          this.tipos = data;
          this.carregandoTipos = false;
          this.cdr.detectChanges();
          resolve();
        },
        error: (err: any) => {
          console.error('Erro ao carregar tipos:', err);
          this.toastService.error('Erro ao carregar tipos de produto');
          this.carregandoTipos = false;
          resolve();
        },
      });
    });
  }

  carregarImagensParaSelect(): Promise<void> {
    this.carregandoImagens = true;
    return new Promise((resolve) => {
      this.imagemService.getImagensParaSelect().subscribe({
        next: (data: ImagemSelect[]) => {
          this.imagensSelect = data;
          this.carregandoImagens = false;
          this.cdr.detectChanges();
          resolve();
        },
        error: (err: any) => {
          console.error('Erro ao carregar imagens:', err);
          this.toastService.error('Erro ao carregar imagens');
          this.carregandoImagens = false;
          resolve();
        },
      });
    });
  }

  carregarProduto(id: number) {
    this.loading = true;
    this.produtoService.getProduto(id).subscribe({
      next: (data: Produto) => {
        this.produto = data;
        if (data.imagem_id) {
          this.carregarPreviewImagem(data.imagem_id);
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Erro ao carregar produto:', err);
        this.loading = false;
        this.toastService.error('Erro ao carregar produto');
        this.router.navigate(['/produtos']);
      },
    });
  }

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
      },
    });
  }

  onImagemSelecionada(event: any) {
    const imagemId = Number(event.target.value);
    if (imagemId) {
      this.carregarPreviewImagem(imagemId);
    } else {
      this.imagemPreview = null;
    }
  }

  salvar() {
    let temMensagem = validaDadosEmBranco(this.produto);

    if (temMensagem) {
      this.toastService.error(temMensagem);
      return;
    }

    this.loading = true;

    if (this.editando) {
      this.produtoService.updateProduto(this.produto.id!, this.produto).subscribe({
        next: () => {
          this.toastService.success('Produto atualizado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: (err: any) => {
          console.error('Erro ao atualizar:', err);
          this.toastService.error('Erro ao atualizar produto');
          this.loading = false;
        },
      });
    } else {
      this.produtoService.createProduto(this.produto).subscribe({
        next: () => {
          this.toastService.success('Produto criado com sucesso!');
          this.router.navigate(['/produtos']);
        },
        error: (err: any) => {
          console.error('Erro ao criar:', err);
          this.toastService.error('Erro ao criar produto');
          this.loading = false;
        },
      });
    }
  }
}
