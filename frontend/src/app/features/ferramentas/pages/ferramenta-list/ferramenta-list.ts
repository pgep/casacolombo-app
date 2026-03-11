import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FerramentaService, Ferramenta } from '../../services/ferramenta';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

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
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.carregarFerramentas();
  }

  carregarFerramentas() {
    this.ferramentaService.getFerramentas().subscribe({
      next: (data: any[]) => {
        this.ferramentas = data.map(item => ({
          id: item.id,
          nome: item.nome || '',
          unidadeMedida: item.unidademedida || '',
          quantidadeEmEstoque: Number(item.quantidadeemestoque || 0),
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Erro ao carregar lista de ferramentas');
      }
    });
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir esta ferramenta?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });

    if (!confirmed) return;
    
    this.ferramentaService.deleteFerramenta(id).subscribe({
      next: () => {
        this.toastService.success('Ferramenta excluida com sucesso!');
        this.carregarFerramentas();
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar ferramenta');
      }
    });

  }
}