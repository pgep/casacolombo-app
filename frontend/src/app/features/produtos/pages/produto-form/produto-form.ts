import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProdutoService, Produto } from '../../services/produto';

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
    custo_total: 0,
    preco_venda: 0,
    preco_final: 0,
    imagem: '',
    ativo: true
  };
  
  tipos: any[] = [];
  editando = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produtoService: ProdutoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarTipos();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarProduto(Number(id));
    }
  }

  carregarTipos() {
    this.produtoService.getTiposProduto().subscribe({
      next: (data) => this.tipos = data,
      error: (err) => console.error('Erro ao carregar tipos:', err)
    });
  }

  carregarProduto(id: number) {
    this.loading = true;
    this.produtoService.getProduto(id).subscribe({
      next: (data) => {
        this.produto = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err);
        this.loading = false;
        this.cdr.detectChanges();
        alert('Erro ao carregar produto');
        this.router.navigate(['/produtos']);
      }
    });
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

    if (this.editando) {
      this.produtoService.updateProduto(this.produto.id!, this.produto).subscribe({
        next: () => this.router.navigate(['/produtos']),
        error: (err) => {
          console.error('Erro ao atualizar:', err);
          alert('Erro ao atualizar produto');
        }
      });
    } else {
      this.produtoService.createProduto(this.produto).subscribe({
        next: () => this.router.navigate(['/produtos']),
        error: (err) => {
          console.error('Erro ao criar:', err);
          alert('Erro ao criar produto');
        }
      });
    }
  }
}