import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ClienteService, Cliente } from './services/cliente';

@Component({
  selector: 'app-root',
  standalone: true,  // ← IMPORTANTE: componente standalone
  imports: [
    CommonModule,     // ← para diretivas como *ngFor, *ngIf
    HttpClientModule, // ← para chamadas HTTP
    FormsModule       // ← para formulários com ngModel
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  title = 'Sistema Casacolombo - Clientes';
  clientes: Cliente[] = [];
  
  novoCliente: Cliente = {
    nome: '',
    email: '',
    telefone: '',
    ativo: true
  };

  editando: boolean = false;
  clienteEditando: Cliente | null = null;

  constructor(
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarClientes();
  }

  carregarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        
        // FORÇA ATUALIZAÇÃO DA VIEW (às vezes necessário)
        this.clientes = [...data]; // cria novo array para forçar detecção de mudanças
        this.cdr.detectChanges();
        setTimeout(() => {
          console.log('Verificação tardia:', this.clientes);
        }, 100);
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        alert('Erro ao conectar com o backend. Verifique se o servidor está rodando na porta 3001.');
      }
    });
  }

  criarCliente() {
    if (!this.novoCliente.nome || !this.novoCliente.email) {
      alert('Nome e email são obrigatórios!');
      return;
    }


    this.clienteService.createCliente(this.novoCliente).subscribe({
      next: (clienteCriado) => {
        
        // 1. LIMPAR OS CAMPOS (corrigido)
        this.novoCliente = { 
          nome: '', 
          email: '', 
          telefone: '', 
          ativo: true 
        };
        
        // 2. RECARREGAR A LISTA
        this.carregarClientes();
        
        alert('Cliente cadastrado com sucesso!');
      },
      error: (err) => {
        console.error('Erro detalhado:', err); // ← DEBUG importante
        if (err.status === 409) {
          alert('Email já cadastrado!');
        } else {
          alert('Erro ao cadastrar. Verifique o console (F12)');
        }
      }
    });
  }

  editarCliente(cliente: Cliente) {
    this.editando = true;
    this.clienteEditando = { ...cliente };
  }

  atualizarCliente() {
    if (!this.clienteEditando?.id) return;

    this.clienteService.updateCliente(this.clienteEditando.id, this.clienteEditando).subscribe({
      next: () => {
        this.carregarClientes();
        this.editando = false;
        this.clienteEditando = null;
        alert('Cliente atualizado!');
      },
      error: (err) => {
        alert('Erro ao atualizar');
        console.error(err);
      }
    });
  }

  cancelarEdicao() {
    this.editando = false;
    this.clienteEditando = null;
  }

  deletarCliente(id: number) {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      this.clienteService.deleteCliente(id).subscribe({
        next: () => {
          this.carregarClientes();
          alert('Cliente removido!');
        },
        error: (err) => {
          alert('Erro ao remover');
          console.error(err);
        }
      });
    }
  }
}