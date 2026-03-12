import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TipoProdutoService, TipoProduto } from '../../services/tipo-produto';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

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
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.carregarTipos();
  }

  carregarTipos() {
    this.loading = true;    
    this.tipoService.getTodos().subscribe({
      next: (data: any[]) => {
        this.tipos = data.map(item => ({
          id: item.id,
          nome: item.nome || '',
          ativo: item.ativo === true || item.ativo === 'true',
          data_cadastro: item.data_cadastro,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('❌ Erro ao carregar tipos:');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  async deletar(id: number) {
    const confirmed = await this.confirmService.confirm({
      title: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir este Tipo Produto?',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });

    if (!confirmed) return;
   
    this.tipoService.deleteTipo(id).subscribe({
      next: () => {
        this.toastService.success('Tipo Produto excluído com sucesso !');
        this.carregarTipos();
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar Tipo de Produto');
      }
    });
    
  }
}