import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-item-card',
  standalone: true,
  imports: [ButtonComponent, CommonModule],
  template: `
    <div
      class="border rounded-lg shadow-md overflow-hidden bg-white flex flex-col"
    >
      <img [src]="image" [alt]="title" class="h-40 w-full object-cover" />
      <div class="p-4 flex-1">
        <h3 class="font-bold text-lg mb-2">{{ title }}</h3>
        <p class="text-gray-600 mb-4">{{ price }}</p>
        <p *ngIf="quantity !== null" class="text-gray-700 font-medium mb-4">
          Quantity: {{ quantity }}
        </p>
      </div>
      <div class="p-4 flex space-x-2">
        <app-button *ngIf="inCart" variant="danger" (onClick)="onRemove()">
          Remove
        </app-button>
        <ng-container *ngIf="!inCart">
          <app-button variant="primary" (onClick)="onAddToCart()">
            Add to Cart
          </app-button>
          <app-button variant="danger" (onClick)="onRemove()">
            Remove
          </app-button>
        </ng-container>
      </div>
    </div>
  `,
  styles: [],
})
export class ItemCardComponent {
  @Input() title: string = '';
  @Input() image: string = '';
  @Input() price: number = 0;
  @Input() quantity: number | null = null;
  @Input() inCart: boolean = false;

  constructor(private toastService: ToastService) {}

  @Output() addToCart = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  onAddToCart() {
    this.addToCart.emit();
    this.toastService.showToast({
      message: `${this.title} added to the cart!`,
      type: 'success',
    });
  }

  onRemove() {
    this.remove.emit();
    this.toastService.showToast({
      message: `${this.title} removed successfully!`,
      type: 'info',
    });
  }
}
