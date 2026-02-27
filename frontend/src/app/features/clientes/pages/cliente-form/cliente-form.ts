import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteService, Cliente } from '../../services/cliente';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cliente-form.html',
  styleUrls: ['./cliente-form.css']
})
export class ClienteFormComponent implements OnInit {
  cliente: Cliente = {
    nome: '',
    email: '',
    telefone: '',
    ativo: true,
    created_at: new Date,
    updated_at: new Date,
  };
  editando = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('🔍 ID do cliente na rota:', id);
    
    if (id) {
      this.editando = true;
      this.carregarCliente(Number(id));
    }
  }

  carregarCliente(id: number) {
    this.loading = true;
    console.log('🔄 Carregando cliente ID:', id);
    this.cdr.detectChanges(); // Mostra "Carregando..." imediatamente
    
    this.clienteService.getCliente(id).subscribe({
      next: (data: any) => {
        console.log('✅ Dados brutos do backend:', data);
        
        // MAPEAMENTO DOS DADOS
        this.cliente = {
          id: data.id,
          nome: data.nome || '',
          email: data.email || '',
          telefone: data.telefone || '',
          ativo: data.ativo === true || data.ativo === 'true', // Garante booleano
          data_cadastro: data.data_cadastro || data.created_at,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        console.log('✅ Dados mapeados:', this.cliente);
        
        // Finalizar carregamento e atualizar template
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar cliente:', err);
        this.loading = false;
        this.cdr.detectChanges();
        alert('Erro ao carregar dados do cliente');
        this.router.navigate(['/clientes']);
      }
    });
  }

  salvar() {
    if (this.editando) {
      console.log('📝 Atualizando cliente:', this.cliente);
      this.clienteService.updateCliente(this.cliente.id!, this.cliente).subscribe({
        next: () => {
          console.log('✅ Cliente atualizado');
          this.router.navigate(['/clientes']);
        },
        error: (err) => {
          console.error('❌ Erro ao atualizar:', err);
          alert('Erro ao atualizar cliente');
        }
      });
    } else {
      console.log('📝 Criando cliente:', this.cliente);
      this.clienteService.createCliente(this.cliente).subscribe({
        next: () => {
          console.log('✅ Cliente criado');
          this.router.navigate(['/clientes']);
        },
        error: (err) => {
          console.error('❌ Erro ao criar:', err);
          alert('Erro ao criar cliente');
        }
      });
    }
  }
}