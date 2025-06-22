import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../logic/services/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section
      class="bg-blue-500 text-white py-12 px-6 md:px-20 text-center flex flex-col items-center"
    >
      <h2 class="text-2xl font-bold mb-4">Join Our Newsletter</h2>
      <p class="text-lg mb-6">
        Get exclusive deals and updates straight to your inbox.
      </p>
      <form
        class="flex flex-col sm:flex-row items-center w-full max-w-md"
        (ngSubmit)="onSubscribe()"
      >
        <input
          type="email"
          [(ngModel)]="email"
          name="email"
          required
          class="px-4 py-2 rounded-md w-full sm:flex-1 mb-4 sm:mb-0 sm:mr-4 text-gray-700"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          class="px-6 py-2 bg-white text-blue-500 rounded-md hover:bg-gray-100"
          [disabled]="isLoading"
        >
          <span *ngIf="!isLoading">Subscribe</span>
          <span *ngIf="isLoading">Subscribing...</span>
        </button>
      </form>
    </section>
  `,
  styles: [],
})
export class FooterComponent {
  email: string = '';
  isLoading: boolean = false;

  constructor(private toastService: ToastService) {}

  onSubscribe() {
    if (!this.email) {
      this.toastService.showToast({
        message: 'Please enter a valid email address.',
        type: 'warning',
      });
      return;
    }

    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.toastService.showToast({
        message: 'Thank you for subscribing!',
        type: 'success',
      });
      this.email = '';
    }, 2000);
  }
}
