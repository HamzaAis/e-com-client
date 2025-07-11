import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../interfaces/Toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  showToast(toast: Omit<Toast, 'createdAt'>) {
    const newToast: Toast = {
      ...toast,
      createdAt: Date.now(), // Add the current timestamp
    };
    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next([...currentToasts, newToast]);

    if (newToast.duration !== 0) {
      setTimeout(() => this.dismissToast(newToast), newToast.duration || 3000);
    }
  }

  dismissToast(toast: Toast) {
    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next(currentToasts.filter((t) => t !== toast));
  }
}
