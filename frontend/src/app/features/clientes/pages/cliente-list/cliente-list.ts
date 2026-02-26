import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // ← ADICIONE NavigationEnd
import { ClienteService, Cliente } from '../../services/cliente';
import { filter } from 'rxjs/operators'; // ← ADICIONE filter

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
    private router: Router  // ← INJETE O Router
  ) {}

  ngOnInit() {
    // 1. Carrega na primeira vez
    this.carregarClientes();

    // 2. Recarrega quando VOLTAR para a rota /clientes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd && event.url === '/clientes'))
      .subscribe(() => {
        console.log('🔄 Recarregando lista de clientes');
        this.carregarClientes();
      });
  }

  carregarClientes() {
    console.log('📊 Carregando clientes...');
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        console.log('✅ Clientes carregados:', this.clientes.length);
      },
      error: (err) => console.error('❌ Erro:', err)
    });
  }

  deletar(id: number) {
    if (confirm('Tem certeza?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => this.carregarClientes(),
        error: (err) => console.error('Erro ao deletar:', err)
      });
    }
  }
}