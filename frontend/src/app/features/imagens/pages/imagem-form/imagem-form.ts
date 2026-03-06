import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ImagemService } from '../../services/imagem';
import { Imagem } from '../../models/imagem.model';

@Component({
  selector: 'app-imagem-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './imagem-form.html',
  styleUrls: ['./imagem-form.css']
})
export class ImagemFormComponent implements OnInit {
  imagem: Imagem = {
    nome: '',
    imagem_base64: ''
  };
  editando = false;
  loading = false;
  arquivoSelecionado: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private imagemService: ImagemService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editando = true;
      this.carregarImagem(Number(id));
    }
  }

  carregarImagem(id: number) {
    this.loading = true;
    this.imagemService.getImagem(id).subscribe({
      next: (data) => {
        this.imagem = data;
        this.previewUrl = this.getBase64Image(data.imagem_base64);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao carregar imagem:', err);
        this.loading = false;
        alert('Erro ao carregar imagem');
        this.router.navigate(['/imagens']);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.arquivoSelecionado = file;
      
      // Preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async salvar() {
    if (!this.imagem.nome) {
      alert('Nome é obrigatório!');
      return;
    }

    // Se tem arquivo novo, converte para base64
    if (this.arquivoSelecionado) {
      try {
        this.imagem.imagem_base64 = await this.imagemService.fileToBase64(this.arquivoSelecionado);
      } catch (error) {
        alert('Erro ao processar imagem');
        return;
      }
    } else if (!this.editando) {
      alert('Selecione uma imagem!');
      return;
    }

    this.loading = true;

    if (this.editando) {
      this.imagemService.updateImagem(this.imagem.id!, this.imagem).subscribe({
        next: () => {
          alert('Imagem atualizada com sucesso!');
          this.router.navigate(['/imagens']);
        },
        error: (err) => {
          console.error('Erro ao atualizar:', err);
          alert('Erro ao atualizar imagem');
          this.loading = false;
        }
      });
    } else {
      this.imagemService.createImagem(this.imagem).subscribe({
        next: () => {
          alert('Imagem criada com sucesso!');
          this.router.navigate(['/imagens']);
        },
        error: (err) => {
          console.error('Erro ao criar:', err);
          alert('Erro ao criar imagem');
          this.loading = false;
        }
      });
    }
  }

  getBase64Image(base64: string): string {
    if (!base64) return '';
    return base64.startsWith('data:image') ? base64 : `data:image/jpeg;base64,${base64}`;
  }
}