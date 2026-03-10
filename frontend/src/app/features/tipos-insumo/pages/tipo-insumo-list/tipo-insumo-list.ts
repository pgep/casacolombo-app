import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TipoInsumoService } from '../../services/tipo-insumo';
import { TipoInsumo } from '../../models/tipo-insumo.model';

@Component({
  selector: 'app-tipo-insumo-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tipo-insumo-list.html',
  styleUrls: ['./tipo-insumo-list.css']
})
export class TipoInsumoListComponent implements OnInit {
  tipos: TipoInsumo[] = [];
  loading = true;

  constructor(
    private tipoInsumoService: TipoInsumoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarTipos();
  }

  carregarTipos() {
    this.loading = true;
    this.tipoInsumoService.getTodos().subscribe({
      next: (data) => {
        this.tipos = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar tipos de insumo:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir este tipo de insumo?')) {
      this.tipoInsumoService.deleteTipo(id).subscribe({
        next: () => {
          alert('Tipo de insumo excluído com sucesso!');
          this.carregarTipos();
        },
        error: (err) => {
          console.error('Erro ao deletar:', err);
          alert('Erro ao deletar tipo de insumo');
        }
      });
    }
  }
}