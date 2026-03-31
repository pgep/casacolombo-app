import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ImagemModalComponent } from './shared/components/imagem-modal/imagem-modal';
import { ToastComponent } from './shared/components/toast/toast';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    HttpClientModule,
    ImagemModalComponent,
    ToastComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  title = 'Sistema Casa Colombo Artesanal';

  // Controles do menu
  isMenuOpen = false;
  isCadastroOpen = false;
  isProducaoOpen = false;
  isOperacionalOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isCadastroOpen = false;
      this.isProducaoOpen = false;
      this.isOperacionalOpen = false;
    }
  }

  toggleCadastro() {
    this.isCadastroOpen = !this.isCadastroOpen;
    if (this.isCadastroOpen) {
      this.isProducaoOpen = false;
      this.isOperacionalOpen = false;
    }
  }

  toggleProducao() {
    this.isProducaoOpen = !this.isProducaoOpen;
    if (this.isProducaoOpen) {
      this.isCadastroOpen = false;
      this.isOperacionalOpen = false;
    }
  }

  toggleOperacional() {
    this.isOperacionalOpen = !this.isOperacionalOpen;
    if (this.isOperacionalOpen) {
      this.isCadastroOpen = false;
      this.isProducaoOpen = false;
    }
  }
}
