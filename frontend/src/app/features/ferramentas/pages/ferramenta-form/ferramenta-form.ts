import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FerramentaService, Ferramenta } from '../../services/ferramenta';
import { ToastService } from '../../../../shared/services/toast.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ferramenta-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule],
  templateUrl: './ferramenta-form.html',
  styleUrls: ['./ferramenta-form.css'],
})
export class FerramentaFormComponent implements OnInit {
  ferramenta: Ferramenta = {
    nome: '',
    unidadeMedida: '',
    quantidadeEmEstoque: 0,
  };
  editando = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ferramentaService: FerramentaService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarFerramenta(Number(id));
    }
  }

  carregarFerramenta(id: number) {
    this.loading = true;
    this.ferramentaService.getFerramenta(id).subscribe({
      next: (data: any) => {
        this.ferramenta = {
          id: data.id,
          nome: data.nome || '',
          unidadeMedida: data.unidademedida || '',
          quantidadeEmEstoque: Number(data.quantidadeemestoque || 0),
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
        this.toastService.error('Erro ao carregar Ferramenta');
        this.router.navigate(['/ferramentas']);
      },
    });
  }

  salvar() {
    // ========== VALIDAÇÕES ==========

    // Validar nome
    if (!this.ferramenta.nome || this.ferramenta.nome.trim() === '') {
      this.toastService.warning('Nome é obrigatório!');
      return;
    }

    // Validar quantidade (não pode ser negativa)
    if (this.ferramenta.quantidadeEmEstoque < 0) {
      this.toastService.warning('Quantidade não pode ser negativa!');
      return;
    }

    this.loading = true;

    if (this.editando) {
      // ========== ATUALIZAR ==========
      this.ferramentaService.updateFerramenta(this.ferramenta.id!, this.ferramenta).subscribe({
        next: () => {
          this.toastService.success('Ferramenta atualizada com sucesso!');
          this.router.navigate(['/ferramentas']);
        },
        error: (err) => {
          this.errorHandler.tratarErro(err, 'Atualizar', 'Ferramenta');
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      // ========== CRIAR ==========
      this.ferramentaService.createFerramenta(this.ferramenta).subscribe({
        next: () => {
          this.toastService.success('Ferramenta cadastrada com sucesso!');
          this.router.navigate(['/ferramentas']);
        },
        error: (err) => {
          console.error('❌ Erro ao criar:', err);
          this.errorHandler.tratarErro(err, 'Criar', 'Produto');
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }
}
