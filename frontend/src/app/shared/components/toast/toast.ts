import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core'; // ← ADICIONE
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: (ToastMessage & { id: number })[] = [];
  private subscription: Subscription;
  private counter = 0;

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef  // ← ADICIONADO
  ) {
    console.log('✅ ToastComponent inicializado');
    
    this.subscription = this.toastService.toast$.subscribe((toast) => {
      if (toast) {
        this.show(toast);
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private show(toast: ToastMessage) {
    console.log('📢 ToastComponent.show chamado:', toast);
    
    const id = ++this.counter;
    const newToast = { ...toast, id };
    
    // FORÇA CRIAÇÃO DE NOVO ARRAY (IMUTABILIDADE)
    this.toasts = [...this.toasts, newToast];
    
    console.log('📦 Array de toasts após adicionar:', this.toasts.length);
    
    // FORÇA DETECÇÃO DE MUDANÇAS
    this.cdr.detectChanges();

    if (toast.duration) {
      setTimeout(() => this.remove(id), toast.duration);
    }
  }

  remove(id: number) {
    // FORÇA CRIAÇÃO DE NOVO ARRAY (IMUTABILIDADE)
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.cdr.detectChanges(); // FORÇA DETECÇÃO DE MUDANÇAS
    console.log('🗑️ Toast removido, restam:', this.toasts.length);
  }

  getIcon(type: string): string {
    const icons: any = {
      success: '✅',
      error: '❌',
      info: 'ℹ️',
      warning: '⚠️'
    };
    return icons[type] || '📋';
  }

  getClass(type: string): string {
    const classes: any = {
      success: 'toast-success',
      error: 'toast-error',
      info: 'toast-info',
      warning: 'toast-warning'
    };
    return classes[type] || '';
  }
}