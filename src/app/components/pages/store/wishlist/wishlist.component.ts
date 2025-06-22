import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistItemDto } from '../../../../logic/interfaces/WishlistItemDto';
import { CartService } from '../../../../logic/services/cart.service';
import { ToastService } from '../../../../logic/services/toast.service';

import { ItemCardComponent } from '../../../shared/item-card/item-card.component';
import { WishlistService } from '../../../../logic/services/wish-list.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, ItemCardComponent],
  template: `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">My Wishlist</h1>
      <ng-container *ngIf="wishlistItems.length; else emptyWishlist">
        <div class="space-y-6">
          <app-item-card
            *ngFor="let item of wishlistItems"
            [title]="item.title"
            [image]="item.image"
            [price]="item.price"
            [stock]="item.stock"
            (addToCart)="handleAddToCart(item)"
            (remove)="handleRemoveFromWishlist(item)"
          ></app-item-card>
        </div>
      </ng-container>
      <ng-template #emptyWishlist>
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg mb-4">Your wishlist is empty.</p>
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
export class WishlistComponent implements OnInit {
  wishlistItems: WishlistItemDto[] = [];
  isLoading = false;

  constructor(
    private wishlistService: WishlistService,
    private toastService: ToastService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlistItems();
  }

  loadWishlistItems() {
    this.isLoading = true;
    this.wishlistService.getWishlist().subscribe({
      next: (wishlist) => {
        this.wishlistItems = wishlist.items || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load wishlist items', err);
        this.toastService.showToast({
          message: 'Failed to load wishlist.',
          type: 'error',
        });
        this.isLoading = false;
      },
    });
  }

  handleAddToCart(item: WishlistItemDto) {
    this.cartService
      .addToCart({
        productId: item.productId,
        quantity: 1,
        price: item.price,
        title: item.title,
        image: item.image,
      })
      .subscribe({
        next: () => {
          this.handleRemoveFromWishlist(item);
          this.toastService.showToast({
            message: `${item.title} moved to the cart!`,
            type: 'success',
          });
        },
        error: (err) => {
          console.error('Failed to add wish-item to cart', err);
          this.toastService.showToast({
            message: `Failed to move ${item.title} to the cart.`,
            type: 'error',
          });
        },
      });
  }

  handleRemoveFromWishlist(item: WishlistItemDto) {
    this.wishlistService.removeFromWishlist(item.productId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(
          (i) => i.productId !== item.productId
        );
        this.toastService.showToast({
          message: `${item.title} removed from the wishlist.`,
          type: 'info',
        });
      },
      error: (err) => {
        console.error('Failed to remove item from wishlist', err);
        this.toastService.showToast({
          message: `Failed to remove ${item.title} from the wishlist.`,
          type: 'error',
        });
      },
    });
  }

  navigateToProducts() {
    this.router.navigate(['/store/products']);
  }
}
