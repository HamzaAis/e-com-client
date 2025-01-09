import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ItemCardComponent } from '../../../components/item-card/item-card.component';
import { CartService } from '../../../services/cart.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  template: `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">My Cart</h1>
      <ng-container *ngIf="cartItems.length; else emptyCart">
        <div class="space-y-6">
          <app-item-card
            *ngFor="let item of cartItems"
            [title]="item.title"
            [image]="item.image"
            [price]="item.price"
            [quantity]="item.quantity"
            [inCart]="true"
            (remove)="handleRemoveFromCart(item)"
          ></app-item-card>
        </div>
      </ng-container>
      <ng-template #emptyCart>
        <p class="text-gray-500 text-center">Your cart is empty.</p>
      </ng-template>
    </div>
  `,
  styles: [],
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartService.getCart().subscribe({
      next: (res) => {
        this.cartItems = res.items || [];
      },
      error: (err) => console.error('Failed to load cart items', err),
    });
  }

handleRemoveFromCart(item: any) {
  this.cartService.removeFromCart(item.productId).subscribe({
    next: () => {
      this.cartItems = this.cartItems.filter(
        (i) => i.productId !== item.productId
      );
      // No success toast here, already handled in ItemCardComponent
    },
    error: (err) => {
      console.error('Failed to remove item from cart', err);
      this.toastService.showToast({
        message: 'Failed to remove item from the cart.',
        type: 'error',
      });
    },
  });
}
}
