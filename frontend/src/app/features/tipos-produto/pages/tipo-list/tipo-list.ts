import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TipoProdutoService, TipoProduto } from '../../services/tipo-produto';

@Component({
  selector: 'app-tipo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tipo-list.html',
  styleUrls: ['./tipo-list.css']
})
export class TipoListComponent implements OnInit {
  tipos: TipoProduto[] = [];
  loading = true;

  constructor(
    private tipoService: TipoProdutoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🔄 Inicializando lista de tipos de produto');
    this.carregarTipos();
  }

  carregarTipos() {
    this.loading = true;
    console.log('🏷️ Carregando tipos de produto...');
    
    this.tipoService.getTodos().subscribe({
      next: (data: any[]) => {
        console.log('✅ Dados brutos:', data);
        
        // Mapeamento dos dados
        this.tipos = data.map(item => ({
          id: item.id,
          nome: item.nome || '',
          ativo: item.ativo === true || item.ativo === 'true',
          data_cadastro: item.data_cadastro,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        
        console.log('✅ Tipos mapeados:', this.tipos);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar tipos:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir este tipo de produto?')) {
      this.tipoService.deleteTipo(id).subscribe({
        next: () => {
          console.log('🗑️ Tipo deletado');
          this.carregarTipos(); // Recarrega a lista
        },
        error: (err) => {
          console.error('❌ Erro ao deletar:', err);
          alert('Erro ao deletar tipo de produto');
        }
      });
    }
  }
}