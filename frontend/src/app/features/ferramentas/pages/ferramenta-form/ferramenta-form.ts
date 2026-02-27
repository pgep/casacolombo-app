import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FerramentaService, Ferramenta } from '../../services/ferramenta';

@Component({
  selector: 'app-ferramenta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ferramenta-form.html',
  styleUrls: ['./ferramenta-form.css']
})
export class FerramentaFormComponent implements OnInit {
  ferramenta: Ferramenta = {
    nome: '',
    unidadeMedida: '',
    quantidadeEmEstoque: 0
  };
  editando = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ferramentaService: FerramentaService,
    private cdr: ChangeDetectorRef  // ← AGORA ESTÁ CORRETAMENTE DECLARADO
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('🔍 ID da ferramenta na rota:', id);
    
    if (id) {
      this.editando = true;
      this.carregarFerramenta(Number(id));
    }
  }

carregarFerramenta(id: number) {
  this.loading = true;  // ← 1. Começa carregando
  
  this.ferramentaService.getFerramenta(id).subscribe({
    next: (data: any) => {      
      // Mapear os dados
      this.ferramenta = {
        id: data.id,
        nome: data.nome || '',
        unidadeMedida: data.unidademedida || '',
        quantidadeEmEstoque: Number(data.quantidadeemestoque || 0)
      };            
      // 🟢 PRIMEIRO: Atualiza loading para false
      this.loading = false;
      
      // 🟢 DEPOIS: Força atualização do template
      this.cdr.detectChanges();      
    },
    error: (err) => {
      console.error('❌ Erro ao carregar ferramenta:', err);
      this.loading = false;  // ← Também atualiza em caso de erro
      this.cdr.detectChanges();
      alert('Erro ao carregar dados da ferramenta');
      this.router.navigate(['/ferramentas']);
    }
  });
}

  salvar() {
    if (this.editando) {
      this.ferramentaService.updateFerramenta(this.ferramenta.id!, this.ferramenta).subscribe({
        next: () => {
          this.router.navigate(['/ferramentas']);
        },
        error: (err) => {
          console.error('❌ Erro ao atualizar:', err);
          alert('Erro ao atualizar ferramenta');
        }
      });
    } else {
      this.ferramentaService.createFerramenta(this.ferramenta).subscribe({
        next: () => {
          this.router.navigate(['/ferramentas']);
        },
        error: (err) => {
          console.error('❌ Erro ao criar:', err);
          alert('Erro ao criar ferramenta');
        }
      });
    }
  }
}