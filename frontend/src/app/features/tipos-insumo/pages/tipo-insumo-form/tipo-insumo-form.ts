import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TipoInsumoService } from '../../services/tipo-insumo';
import { TipoInsumo } from '../../models/tipo-insumo.model';

@Component({
  selector: 'app-tipo-insumo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tipo-insumo-form.html',
  styleUrls: ['./tipo-insumo-form.css']
})
export class TipoInsumoFormComponent implements OnInit {
  tipo: TipoInsumo = {
    nome: '',
    ativo: true
  };
  editando = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoInsumoService: TipoInsumoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarTipo(Number(id));
    }
  }

  carregarTipo(id: number) {
    this.loading = true;
    this.tipoInsumoService.getTipo(id).subscribe({
      next: (data) => {
        this.tipo = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar tipo de insumo:', err);
        this.loading = false;
        alert('Erro ao carregar dados');
        this.router.navigate(['/tipos-insumo']);
      }
    });
  }

  salvar() {
    if (!this.tipo.nome) {
      alert('Nome é obrigatório!');
      return;
    }

    this.loading = true;

    if (this.editando) {
      this.tipoInsumoService.updateTipo(this.tipo.id!, this.tipo).subscribe({
        next: () => {
          alert('Tipo de insumo atualizado com sucesso!');
          this.router.navigate(['/tipos-insumo']);
        },
        error: (err) => {
          console.error('Erro ao atualizar:', err);
          alert('Erro ao atualizar');
          this.loading = false;
        }
      });
    } else {
      this.tipoInsumoService.createTipo(this.tipo).subscribe({
        next: () => {
          alert('Tipo de insumo criado com sucesso!');
          this.router.navigate(['/tipos-insumo']);
        },
        error: (err) => {
          console.error('Erro ao criar:', err);
          alert('Erro ao criar');
          this.loading = false;
        }
      });
    }
  }
}