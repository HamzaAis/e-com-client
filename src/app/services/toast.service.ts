import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // in milliseconds
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  showToast(toast: Toast) {
    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next([...currentToasts, toast]);

    if (toast.duration !== 0) {
      setTimeout(() => this.dismissToast(toast), toast.duration || 3000);
    }
  }

  dismissToast(toast: Toast) {
    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next(currentToasts.filter((t) => t !== toast));
  }
}
