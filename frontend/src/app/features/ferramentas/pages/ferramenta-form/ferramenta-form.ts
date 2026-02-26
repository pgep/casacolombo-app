import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FerramentaService } from '../../services/ferramenta';
import { Ferramenta } from '../../models/ferramenta.model';

@Component({
  selector: 'app-ferramenta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <h2>{{ editando ? '✏️ Editar' : '➕ Nova' }} Ferramenta</h2>

      <form (ngSubmit)="salvar()">
        <div class="form-group">
          <label>Nome:</label>
          <input type="text" [(ngModel)]="ferramenta.nome" name="nome" required>
        </div>

        <div class="form-group">
          <label>Unidade de Medida:</label>
          <input type="text" [(ngModel)]="ferramenta.unidadeMedida" name="unidadeMedida" placeholder="ex: kg, unidade, metro">
        </div>

        <div class="form-group">
          <label>Quantidade em Estoque:</label>
          <input type="number" [(ngModel)]="ferramenta.quantidadeEmEstoque" name="quantidadeEmEstoque" min="0" step="0.01">
        </div>

        <div class="actions">
          <button type="submit" class="btn-salvar">💾 Salvar</button>
          <button type="button" class="btn-cancelar" routerLink="/ferramentas">❌ Cancelar</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 20px auto; padding: 20px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; }
    input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .actions { display: flex; gap: 10px; margin-top: 20px; }
    .btn-salvar { background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
    .btn-cancelar { background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
  `]
})
export class FerramentaFormComponent implements OnInit {
  ferramenta: Ferramenta = {
    nome: '',
    unidadeMedida: '',
    quantidadeEmEstoque: 0
  };
  editando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ferramentaService: FerramentaService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.ferramentaService.getFerramenta(Number(id)).subscribe({
        next: (data) => this.ferramenta = data,
        error: (err) => console.error('Erro ao carregar:', err)
      });
    }
  }

  salvar() {
    if (this.editando) {
      this.ferramentaService.updateFerramenta(this.ferramenta.id!, this.ferramenta).subscribe({
        next: () => this.router.navigate(['/ferramentas']),
        error: (err) => console.error('Erro ao atualizar:', err)
      });
    } else {
      this.ferramentaService.createFerramenta(this.ferramenta).subscribe({
        next: () => this.router.navigate(['/ferramentas']),
        error: (err) => console.error('Erro ao criar:', err)
      });
    }
  }
}