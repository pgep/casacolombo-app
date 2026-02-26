import { Component, OnInit } from '@angular/core';
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
    ativo: true
  };
  editando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.clienteService.getCliente(Number(id)).subscribe({
        next: (data) => this.cliente = data,
        error: (err) => console.error('Erro ao carregar:', err)
      });
    }
  }

  salvar() {
    if (this.editando) {
      this.clienteService.updateCliente(this.cliente.id!, this.cliente).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err) => console.error('Erro ao atualizar:', err)
      });
    } else {
      this.clienteService.createCliente(this.cliente).subscribe({
        next: () => this.router.navigate(['/clientes']),
        error: (err) => console.error('Erro ao criar:', err)
      });
    }
  }
}