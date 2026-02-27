import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FerramentaService, Ferramenta } from '../../services/ferramenta';

@Component({
  selector: 'app-ferramenta-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ferramenta-list.html',
  styleUrls: ['./ferramenta-list.css']
})
export class FerramentaListComponent implements OnInit {
  ferramentas: Ferramenta[] = [];

  constructor(
    private ferramentaService: FerramentaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🔄 Inicializando lista de ferramentas');
    this.carregarFerramentas();
  }

  carregarFerramentas() {
    console.log('🔧 Carregando ferramentas...');
    this.ferramentaService.getFerramentas().subscribe({
      next: (data: any[]) => {
        console.log('✅ Dados brutos do backend:', data);
        
        // MAPEAMENTO DOS CAMPOS
        this.ferramentas = data.map(item => ({
          id: item.id,
          nome: item.nome || '',
          unidadeMedida: item.unidademedida || '',
          quantidadeEmEstoque: Number(item.quantidadeemestoque || 0),
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        
        console.log('✅ Ferramentas mapeadas:', this.ferramentas);
        console.log('📊 Total:', this.ferramentas.length);
        
        // Forçar atualização da view
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar ferramentas:', err);
        alert('Erro ao carregar lista de ferramentas');
      }
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir esta ferramenta?')) {
      this.ferramentaService.deleteFerramenta(id).subscribe({
        next: () => {
          console.log('🗑️ Ferramenta deletada');
          this.carregarFerramentas(); // Recarrega a lista
        },
        error: (err) => {
          console.error('❌ Erro ao deletar:', err);
          alert('Erro ao deletar ferramenta');
        }
      });
    }
  }
}