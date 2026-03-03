import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TipoProdutoService, TipoProduto } from '../../services/tipo-produto';

@Component({
  selector: 'app-tipo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tipo-form.html',
  styleUrls: ['./tipo-form.css']
})
export class TipoFormComponent implements OnInit {
  tipo: TipoProduto = {
    nome: '',
    ativo: true
  };
  editando = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoService: TipoProdutoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('🔍 ID do tipo na rota:', id);
    
    if (id) {
      this.editando = true;
      this.carregarTipo(Number(id));
    }
  }

  carregarTipo(id: number) {
    this.loading = true;
    console.log('🔄 Carregando tipo ID:', id);
    this.cdr.detectChanges();
    
    this.tipoService.getTipo(id).subscribe({
      next: (data: any) => {
        console.log('✅ Dados brutos:', data);
        
        this.tipo = {
          id: data.id,
          nome: data.nome || '',
          ativo: data.ativo === true || data.ativo === 'true',
          data_cadastro: data.data_cadastro,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        console.log('✅ Dados mapeados:', this.tipo);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar tipo:', err);
        this.loading = false;
        this.cdr.detectChanges();
        alert('Erro ao carregar dados do tipo de produto');
        this.router.navigate(['/tipos-produto']);
      }
    });
  }

  salvar() {
    if (!this.tipo.nome) {
      alert('Nome é obrigatório!');
      return;
    }

    if (this.editando) {
      console.log('📝 Atualizando tipo:', this.tipo);
      this.tipoService.updateTipo(this.tipo.id!, this.tipo).subscribe({
        next: () => {
          console.log('✅ Tipo atualizado');
          this.router.navigate(['/tipos-produto']);
        },
        error: (err) => {
          console.error('❌ Erro ao atualizar:', err);
          alert('Erro ao atualizar tipo de produto');
        }
      });
    } else {
      console.log('📝 Criando tipo:', this.tipo);
      this.tipoService.createTipo(this.tipo).subscribe({
        next: () => {
          console.log('✅ Tipo criado');
          this.router.navigate(['/tipos-produto']);
        },
        error: (err) => {
          console.error('❌ Erro ao criar:', err);
          alert('Erro ao criar tipo de produto');
        }
      });
    }
  }
}