import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ToastMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new Subject<ToastMessage | null>();
  toast$ = this.toastSubject.asObservable();

  success(message: string, title: string = 'Sucesso') {
    this.show({ type: 'success', title, message, duration: 4000 });
  }

  error(message: string, title: string = 'Erro') {
    this.show({ type: 'error', title, message, duration: 4000 });
  }

  info(message: string, title: string = 'Informação') {
    this.show({ type: 'info', title, message, duration: 4000 });
  }

  warning(message: string, title: string = 'Atenção') {
    this.show({ type: 'warning', title, message, duration: 4000 });
  }

  private show(toast: ToastMessage) {
    this.toastSubject.next(toast);
  }

  clear() {
    this.toastSubject.next(null);
  }
}