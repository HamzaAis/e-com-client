import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemDto } from '../../../../logic/interfaces/CartItemDto';
import { CartService } from '../../../../logic/services/cart.service';
import { ToastService } from '../../../../logic/services/toast.service';
import { ItemCardComponent } from '../../../shared/item-card/item-card.component';

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
            (increaseQuantity)="handleIncreaseQuantity(item)"
            (decreaseQuantity)="handleDecreaseQuantity(item)"
          ></app-item-card>
        </div>
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <p class="text-xl font-semibold">
            Total: {{ getTotalPrice() | currency }}
          </p>
          <button
            class="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            (click)="handleCheckout()"
          >
            Proceed to Checkout
          </button>
        </div>
      </ng-container>
      <ng-template #emptyCart>
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg mb-4">Your cart is empty.</p>
          <button
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            (click)="navigateToProducts()"
          >
            Continue Shopping
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [],
})
export class CartComponent implements OnInit {
  cartItems: CartItemDto[] = [];
  isLoading = false;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (cart) => {
        this.cartItems = cart.items || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load cart items', err);
        this.toastService.showToast({
          message: 'Failed to load your cart.',
          type: 'error',
        });
        this.isLoading = false;
      },
    });
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  handleRemoveFromCart(item: CartItemDto) {
    this.cartService.removeFromCart(item.productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(
          (i) => i.productId !== item.productId
        );
        this.toastService.showToast({
          message: `${item.title} removed from the cart.`,
          type: 'info',
        });
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

  handleIncreaseQuantity(item: CartItemDto) {
    this.cartService
      .updateProductQuantity(item.productId, item.quantity + 1)
      .subscribe({
        next: (cart) => {
          this.cartItems = cart.items;
        },
        error: (err) => {
          console.error('Failed to increase quantity', err);
          this.toastService.showToast({
            message: 'Failed to increase quantity.',
            type: 'error',
          });
        },
      });
  }

  handleDecreaseQuantity(item: CartItemDto) {
    if (item.quantity <= 1) {
      this.handleRemoveFromCart(item);
      return;
    }
    this.cartService
      .updateProductQuantity(item.productId, item.quantity - 1)
      .subscribe({
        next: (cart) => {
          this.cartItems = cart.items;
        },
        error: (err) => {
          console.error('Failed to decrease quantity', err);
          this.toastService.showToast({
            message: 'Failed to decrease quantity.',
            type: 'error',
          });
        },
      });
  }

  handleCheckout() {
    this.router.navigate(['/checkout']);
  }

  navigateToProducts() {
    this.router.navigate(['/store/products']);
  }
}
