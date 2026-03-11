import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService, Cliente } from '../../services/cliente';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cliente-list.html',
  styleUrls: ['./cliente-list.css']
})
export class ClienteListComponent implements OnInit {
  clientes: Cliente[] = [];

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data: any[]) => {        
        this.clientes = data.map(item => ({
          id: item.id,
          nome: item.nome || '',
          email: item.email || '',
          telefone: item.telefone || '',
          ativo: item.ativo === true || item.ativo === 'true', // Garante booleano
          data_cadastro: item.data_cadastro || item.created_at,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));        
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toastService.error('Erro ao carregar lista de clientes');
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

    
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        this.toastService.success('Cliente excluido com sucesso!');
        this.carregarClientes();
      },
      error: (err) => {
        this.toastService.error(err,'Erro ao deletar cliente');
      }
    });
    
  }
}