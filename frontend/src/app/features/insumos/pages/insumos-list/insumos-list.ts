import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InsumoService } from '../../services/insumos';
import { Insumo } from '../../models/insumos.model';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-insumo-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './insumos-list.html',
})
export class InsumoListComponent implements OnInit {
  displayedColumns = ['nome', 'unidade', 'estoque', 'custo', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Insumo>([]);
  loading = true;
  incluirInativos = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private service: InsumoService,
    private toastService: ToastService,
    private confirm: ConfirmService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarInsumos();
  }

  carregarInsumos() {
    this.loading = true;
    this.cdr.detectChanges();

    this.service.getInsumos(this.incluirInativos).subscribe({
      next: (data) => {
        this.dataSource.data = data;

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar insumos:', err);
        this.toastService.error('Erro ao carregar insumos');
        this.loading = false;
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  toggleIncluirInativos(event: any) {
    this.incluirInativos = event.checked;
    this.carregarInsumos();
  }

  // ✅ MÉTODO ALTERADO - Delete com validação
  async deletar(id: number, nome: string, quantidadeEstoque: number, ativo: boolean) {
    // ✅ Esta validação já existe e exibe o toast
    if (ativo && quantidadeEstoque > 0) {
      this.toastService.warning(
        `Não é possível excluir/inativar "${nome}". Estoque atual é ${quantidadeEstoque} unidades. ` +
          `Registre uma saída para zerar o estoque primeiro.`,
      );
      return; // Impede a continuação
    }

    // Se estiver ativo e tem estoque positivo, bloqueia
    if (ativo && quantidadeEstoque > 0) {
      this.toastService.warning(
        `Não é possível excluir/inativar "${nome}". Estoque atual é ${quantidadeEstoque} unidades. ` +
          `Registre uma saída para zerar o estoque primeiro.`,
      );
      return;
    }

    // Se estiver inativo, confirma exclusão permanente
    if (!ativo) {
      const confirmed = await this.confirm.confirm({
        title: 'Excluir Permanentemente',
        message: `Tem certeza que deseja EXCLUIR PERMANENTEMENTE o insumo "${nome}"? Esta ação não pode ser desfeita.`,
        confirmText: 'Sim, excluir',
        cancelText: 'Cancelar',
      });

      if (confirmed) {
        this.executarExclusao(id, nome, 'excluir');
      }
      return;
    }

    // Se estiver ativo e estoque = 0, confirma inativação
    const confirmed = await this.confirm.confirm({
      title: 'Inativar Insumo',
      message: `O insumo "${nome}" será INATIVADO. Ele não poderá mais ser usado em novas produções, mas o histórico será mantido. Deseja continuar?`,
      confirmText: 'Sim, inativar',
      cancelText: 'Cancelar',
    });

    if (confirmed) {
      this.executarExclusao(id, nome, 'inativar');
    }
  }

  // ✅ MÉTODO NOVO - Executar exclusão ou inativação
  private executarExclusao(id: number, nome: string, tipo: 'excluir' | 'inativar') {
    this.loading = true;

    this.service.deleteInsumo(id).subscribe({
      next: (resultado: any) => {
        const mensagem =
          tipo === 'excluir'
            ? `Insumo "${nome}" excluído permanentemente!`
            : `Insumo "${nome}" inativado! Use o filtro "Incluir inativos" para visualizá-lo.`;

        this.toastService.success(mensagem);
        this.carregarInsumos();
      },
      error: (error) => {
        console.error('Erro na operação:', error);
        this.toastService.error(error.error?.error || 'Erro ao processar solicitação');
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ✅ MÉTODO NOVO - Reativar insumo
  async reativar(id: number, nome: string) {
    const confirmed = await this.confirm.confirm({
      title: 'Reativar Insumo',
      message: `Deseja reativar o insumo "${nome}"? Ele voltará a ficar disponível para novas produções.`,
      confirmText: 'Sim, reativar',
      cancelText: 'Cancelar',
    });

    if (confirmed) {
      this.loading = true;

      this.service.reativarInsumo(id).subscribe({
        next: () => {
          this.toastService.success(`Insumo "${nome}" reativado com sucesso!`);
          this.carregarInsumos();
        },
        error: (error) => {
          console.error('Erro ao reativar:', error);
          this.toastService.error(error.error?.error || 'Erro ao reativar insumo');
          this.loading = false;
        },
      });
    }
  }
}
