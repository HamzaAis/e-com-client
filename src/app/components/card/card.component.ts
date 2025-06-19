import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  template: `
    <div
      class="border rounded-lg shadow-md overflow-hidden bg-white flex flex-col"
    >
      <div
        *ngIf="isLoading"
        class="h-40 w-full bg-gray-200 animate-pulse"
      ></div>
      <ng-container *ngIf="!isLoading">
        <img [src]="image" [alt]="title" class="h-40 w-full object-cover" />
        <div class="p-4 flex-1">
          <h3 class="font-bold text-lg mb-2">{{ title }}</h3>
          <p class="text-gray-600 mb-4">{{ price | currency }}</p>
          <p *ngIf="stock > 0" class="text-green-600 font-medium mb-4">
            In Stock: {{ stock }}
          </p>
          <p *ngIf="stock === 0" class="text-red-600 font-medium mb-4">
            Out of Stock
          </p>
        </div>
        <div class="p-4 flex space-x-2">
          <app-button
            variant="primary"
            (onClick)="onAddToCart()"
            [disabled]="stock === 0"
          >
            Add to Cart
          </app-button>
          <app-button variant="secondary" (onClick)="onAddToWishlist()">
            Add to Wishlist
          </app-button>
        </div>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class CardComponent {
  @Input() title: string = '';
  @Input() image: string = '';
  @Input() price: number = 0;
  @Input() stock: number = 0;
  @Input() isLoading: boolean = false;

  constructor(private toastService: ToastService) {}

  @Output() addToCart = new EventEmitter<void>();
  @Output() addToWishlist = new EventEmitter<void>();

  onAddToCart() {
    if (this.stock > 0) {
      this.addToCart.emit();
      this.toastService.showToast({
        message: `${this.title} added to the cart!`,
        type: 'success',
        duration: 3000, // Optional: Add duration if needed
      });
    }
  }

  onAddToWishlist() {
    this.addToWishlist.emit();
    this.toastService.showToast({
      message: `${this.title} added to the wishlist!`,
      type: 'success',
      duration: 3000, // Optional: Add duration if needed
    });
  }
}
