import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private confirmSubject = new Subject<ConfirmDialogData | null>();
  confirm$ = this.confirmSubject.asObservable();

  private responseSubject = new Subject<boolean>();
  response$ = this.responseSubject.asObservable();

  confirm(data: ConfirmDialogData): Promise<boolean> {
    this.confirmSubject.next(data);
    
    return new Promise((resolve) => {
      const subscription = this.response$.subscribe((result) => {
        subscription.unsubscribe();
        resolve(result);
      });
    });
  }

  respond(result: boolean) {
    this.responseSubject.next(result);
    this.confirmSubject.next(null);
  }
}