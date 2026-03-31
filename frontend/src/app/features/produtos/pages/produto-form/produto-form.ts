import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProdutoService } from '../../services/produto';
import { ImagemService } from '../../../imagens/services/imagem';
import { Produto, ProdutoInsumo } from '../../models/produto.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { MatButtonModule } from '@angular/material/button';
import { InsumoService } from '../../../insumos/services/insumos';
import { Insumo } from '../../../insumos/models/insumos.model';

export interface TipoProduto {
  id: number;
  nome: string;
}

export interface ImagemSelect {
  id: number;
  nome: string;
}

function validaDadosEmBranco(p: Produto): string | false {
  if (!p.nome?.trim()) return 'O nome é obrigatório!';
  if (!p.descricao?.trim()) return 'Insira uma descrição!';
  if (!p.tipo_produto_id) return 'Tipo produto obrigatório!';
  if (!p.imagem_id) return 'Selecione uma imagem!';

  // ✅ VERIFICAÇÃO SEGURA
  if (!p.insumos || p.insumos.length === 0) {
    return 'Adicione ao menos um insumo!';
  }

  // Validar cada insumo
  for (let i = 0; i < p.insumos.length; i++) {
    const item = p.insumos[i];
    if (!item.insumo_id || item.insumo_id === 0) {
      return `Insumo #${i + 1}: selecione um insumo válido!`;
    }
    if (!item.quantidade || item.quantidade <= 0) {
      return `Insumo #${i + 1}: quantidade deve ser maior que zero!`;
    }
  }

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
    insumos: [], // ✅ JÁ COMO ARRAY VAZIO
  };

  tipos: TipoProduto[] = [];
  imagensSelect: ImagemSelect[] = [];
  insumosLista: Insumo[] = [];
  editando = false;
  loading = false;
  carregandoTipos = true;
  carregandoImagens = true;
  carregandoInsumos = true;
  imagemPreview: string | null = null;
  margemLucro = 2;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private imagemService: ImagemService,
    private insumoService: InsumoService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    Promise.all([
      this.carregarTipos(),
      this.carregarImagensParaSelect(),
      this.carregarInsumos(),
    ]).then(() => {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.editando = true;
        this.carregarProduto(Number(id));
      }
    });
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

  carregarInsumos(): Promise<void> {
    this.carregandoInsumos = true;
    return new Promise((resolve) => {
      this.insumoService.getInsumos().subscribe({
        next: (data: Insumo[]) => {
          this.insumosLista = data;
          this.carregandoInsumos = false;
          this.cdr.detectChanges();
          resolve();
        },
        error: (err: any) => {
          console.error('Erro ao carregar insumos:', err);
          this.toastService.error('Erro ao carregar insumos');
          this.carregandoInsumos = false;
          resolve();
        },
      });
    });
  }

  carregarProduto(id: number) {
    this.loading = true;
    this.produtoService.getProduto(id).subscribe({
      next: (data: any) => {
        this.produto = {
          id: data.id,
          nome: data.nome,
          descricao: data.descricao || '',
          tipo_produto_id: data.tipo_produto_id,
          imagem_id: data.imagem_id,
          custo_total: Number(data.custo_total) || 0,
          preco_venda: Number(data.preco_venda) || 0,
          preco_final: Number(data.preco_final) || 0,
          ativo: data.ativo,
          insumos: data.insumos || [], // ✅ GARANTE QUE É ARRAY
        };

        this.calcularCustosUnitarios();

        if (data.imagem_id) {
          this.carregarPreviewImagem(data.imagem_id);
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err);
        this.toastService.error('Erro ao carregar produto');
        this.loading = false;
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

  calcularCustosUnitarios() {
    // ✅ VERIFICAÇÃO SEGURA
    if (!this.produto.insumos) return;

    this.produto.insumos.forEach((item) => {
      const insumo = this.insumosLista.find((i) => i.id === item.insumo_id);
      if (insumo && insumo.custo_unitario_base) {
        item.custo_unitario = Number(insumo.custo_unitario_base);
      }
    });
    this.calcularCustoTotal();
  }

  calcularCustoTotal() {
    let total = 0;

    // ✅ VERIFICAÇÃO SEGURA
    if (this.produto.insumos) {
      this.produto.insumos.forEach((item) => {
        const custoUnitario = item.custo_unitario || 0;
        const quantidade = item.quantidade || 0;
        total += custoUnitario * quantidade;
      });
    }

    this.produto.custo_total = parseFloat(total.toFixed(2));
    this.produto.preco_venda = parseFloat((this.produto.custo_total * this.margemLucro).toFixed(2));

    if (!this.produto.preco_final || this.produto.preco_final === 0) {
      // this.produto.preco_final = this.produto.preco_venda;
    }
  }

  onInsumoSelecionado(index: number) {
    if (!this.produto.insumos) return;

    const item = this.produto.insumos[index];
    const insumoId = Number(item.insumo_id);
    const insumo = this.insumosLista.find((i) => i.id === insumoId);

    if (insumo) {
      item.custo_unitario = Number(insumo.custo_unitario_base);
    } else {
      item.custo_unitario = 0;
    }

    this.calcularCustoTotal();
    this.cdr.detectChanges();
  }

  adicionarInsumo() {
    if (!this.produto.insumos) {
      this.produto.insumos = [];
    }
    this.produto.insumos.push({
      insumo_id: 0,
      quantidade: 1,
      custo_unitario: 0,
    });
    this.cdr.detectChanges();
  }

  removerInsumo(index: number) {
    if (this.produto.insumos) {
      this.produto.insumos.splice(index, 1);
      this.calcularCustoTotal();
      this.cdr.detectChanges();
    }
  }

  salvar() {
    const erro = validaDadosEmBranco(this.produto);
    if (erro) {
      this.toastService.error(erro);
      return;
    }

    this.calcularCustoTotal();

    // ✅ GARANTE QUE INSUMOS ESTÁ DEFINIDO
    const dadosParaEnvio = {
      ...this.produto,
      insumos:
        this.produto.insumos?.map((item) => ({
          insumo_id: item.insumo_id,
          quantidade: item.quantidade,
          custo_unitario: item.custo_unitario,
        })) || [],
    };

    this.loading = true;

    const request = this.editando
      ? this.produtoService.updateProduto(this.produto.id!, dadosParaEnvio)
      : this.produtoService.createProduto(dadosParaEnvio);

    request.subscribe({
      next: () => {
        this.toastService.success(
          this.editando ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!',
        );
        this.router.navigate(['/produtos']);
      },
      error: (err: any) => {
        console.error('Erro ao salvar produto:', err);
        this.toastService.error('Erro ao salvar produto');
        this.loading = false;
      },
    });
  }
}
