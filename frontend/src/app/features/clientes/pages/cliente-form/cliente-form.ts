import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClienteService, Cliente } from '../../services/cliente';
import { ToastService } from '../../../../shared/services/toast.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';

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
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');    
    if (id) {
      this.editando = true;
      this.carregarCliente(Number(id));
    }
  }

  carregarCliente(id: number) {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.clienteService.getCliente(id).subscribe({
      next: (data: any) => {
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
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.toastService.error('Erro ao carregar Cliente!');
        this.router.navigate(['/clientes']);
      }
    });
  }

  salvar() {
    // ========== VALIDAÇÕES ==========
    
    // Validar nome
    if (!this.cliente.nome || this.cliente.nome.trim() === '') {
      this.toastService.warning('Nome é obrigatório!');
      return;
    }

    // Validar email
    if (!this.cliente.email || this.cliente.email.trim() === '') {
      this.toastService.warning('Email é obrigatório!');
      return;
    }

    // Validar formato do email (opcional, mas recomendado)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.cliente.email)) {
      this.toastService.warning('Email inválido! Digite um email válido.');
      return;
    }

    // Validar telefone (opcional)
    if (this.cliente.telefone && this.cliente.telefone.trim() === '') {
      this.cliente.telefone = ''; // Garantir que não seja espaço em branco
    }

    this.loading = true;

    if (this.editando) {
      // ========== ATUALIZAR ==========
      this.clienteService.updateCliente(this.cliente.id!, this.cliente).subscribe({
        next: () => {
          this.toastService.success('Cliente atualizado com sucesso!');
          this.router.navigate(['/clientes']);
        },
        error: (err) => {
          console.error('Erro ao atualizar:', err);
          this.errorHandler.tratarErro(err,'Atualizar','Cliente');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // ========== CRIAR ==========
      this.clienteService.createCliente(this.cliente).subscribe({
        next: () => {
          this.toastService.success('Cliente cadastrado com sucesso!');
          this.router.navigate(['/clientes']);
        },
        error: (err) => {
          console.error('Erro ao criar:', err);
          this.errorHandler.tratarErro(err,'Criar','Cliente');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
  
}