import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ImagemModalComponent } from './shared/components/imagem-modal/imagem-modal'; // ← IMPORT DO MODAL
import { ToastComponent } from './shared/components/toast/toast';
import { ConfirmModalComponent } from './shared/components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet, // ← para o <router-outlet>
    RouterModule, // ← para routerLink
    HttpClientModule,
    ImagemModalComponent, // ← para chamadas HTTP
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
  isTiposOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.isCadastroOpen = false;
      this.isTiposOpen = false;
    }
  }

  toggleCadastro() {
    this.isCadastroOpen = !this.isCadastroOpen;
    if (this.isCadastroOpen) this.isTiposOpen = false;
  }

  toggleTipos() {
    this.isTiposOpen = !this.isTiposOpen;
    if (this.isTiposOpen) this.isCadastroOpen = false;
  }
}
