import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TipoInsumoService } from '../../services/tipo-insumo';
import { TipoInsumo } from '../../models/tipo-insumo.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

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
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService
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
        this.toastService.error('Erro ao carregar tipos de insumo');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este tipo de insumo?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });

    if (!confirmed) return;

    this.tipoInsumoService.deleteTipo(id).subscribe({
      next: () => {
        this.toastService.success('Tipo de insumo excluído com sucesso!');
        this.carregarTipos();
      },
      error: (err) => {
        console.error('Erro ao deletar:', err);
        this.toastService.error('Erro ao deletar tipo de insumo');
      }
    });
  }
}