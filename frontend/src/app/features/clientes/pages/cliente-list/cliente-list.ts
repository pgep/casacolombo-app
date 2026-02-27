import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClienteService, Cliente } from '../../services/cliente';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('🔄 Inicializando lista de clientes');
    this.carregarClientes();
  }

  carregarClientes() {
    console.log('👥 Carregando clientes...');
    this.clienteService.getClientes().subscribe({
      next: (data: any[]) => {
        console.log('✅ Dados brutos do backend:', data);
        
        // MAPEAMENTO DOS CAMPOS (caso necessário)
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
        
        console.log('✅ Clientes mapeados:', this.clientes);
        console.log('📊 Total:', this.clientes.length);
        
        // Forçar atualização da view
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar clientes:', err);
        alert('Erro ao carregar lista de clientes');
      }
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          console.log('🗑️ Cliente deletado');
          this.carregarClientes(); // Recarrega a lista
        },
        error: (err) => {
          console.error('❌ Erro ao deletar:', err);
          alert('Erro ao deletar cliente');
        }
      });
    }
  }
}