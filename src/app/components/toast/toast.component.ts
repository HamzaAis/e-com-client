import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 space-y-2 z-50">
      <div
        *ngFor="let toast of toasts"
        [class]="getToastClass(toast.type)"
        class="p-4 rounded shadow-lg text-white"
      >
        {{ toast.message }}
        <button
          class="text-white ml-4"
          (click)="dismissToast(toast)"
          aria-label="Close"
        >
          ✖
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-success {
        background-color: #28a745;
      }
      .toast-error {
        background-color: #dc3545;
      }
      .toast-info {
        background-color: #17a2b8;
      }
      .toast-warning {
        background-color: #ffc107;
      }
    `,
  ],
})
export class ToastComponent {
  toasts: any;

  constructor(private toastService: ToastService) {
    this.toasts = this.toastService.toasts$;
  }

  getToastClass(type: string): string {
    return `toast-${type}`;
  }

  dismissToast(toast: any) {
    this.toastService.dismissToast(toast);
  }
}
