import { Component, OnInit, ChangeDetectorRef, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TipoProdutoService, TipoProduto } from '../../services/tipo-produto';
import { ToastService } from '../../../../shared/services/toast.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler.service';

@Component({
  selector: 'app-tipo-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tipo-form.html',
  styleUrls: ['./tipo-form.css']
})
export class TipoFormComponent implements OnInit {
  tipo: TipoProduto = {
    nome: '',
    ativo: true
  };
  editando = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tipoService: TipoProdutoService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.editando = true;
      this.carregarTipo(Number(id));
    }
  }

  carregarTipo(id: number) {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.tipoService.getTipo(id).subscribe({
      next: (data: any) => {        
        this.tipo = {
          id: data.id,
          nome: data.nome || '',
          ativo: data.ativo === true || data.ativo === 'true',
          data_cadastro: data.data_cadastro,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erro ao carregar tipo:', err);
        this.loading = false;
        this.cdr.detectChanges();
        alert('Erro ao carregar dados do tipo de produto');
        this.router.navigate(['/tipos-produto']);
      }
    });
  }

  salvar() {
    if (!this.tipo.nome) {
      this.toastService.error('Nome é obrigatório!');
      return;
    }
    const dadosParaEnvio = {
      nome: this.tipo.nome,
      ativo: this.tipo.ativo
    };

    if (this.editando) {
      this.tipoService.updateTipo(this.tipo.id!, dadosParaEnvio).subscribe({
        next: () => {
          this.router.navigate(['/tipos-produto']);
        },
        error: (err) => {
          this.errorHandler.tratarErro(err,'Atualizar','Tipo Produto');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.tipoService.createTipo(dadosParaEnvio).subscribe({
        next: () => {
          this.router.navigate(['/tipos-produto']);
        },
        error: (err) => {
          this.errorHandler.tratarErro(err,'Criar','Tipo Produto');
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }
}