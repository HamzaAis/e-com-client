import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ItemCardComponent } from '../../../components/item-card/item-card.component';
import { CartService } from '../../../services/cart.service';
import { WishListService } from '../../../services/wish-list.service';

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
            (addToCart)="handleAddToCart(item)"
            (remove)="handleRemoveFromWishlist(item)"
          ></app-item-card>
        </div>
      </ng-container>
      <ng-template #emptyWishlist>
        <p class="text-gray-500 text-center">Your wishlist is empty.</p>
      </ng-template>
    </div>
  `,
  styles: [],
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];

  constructor(
    private wishListService: WishListService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadWishlistItems();
  }

  loadWishlistItems() {
    this.wishListService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistItems = res.items || [];
      },
      error: (err) => console.error('Failed to load wishlist items', err),
    });
  }

  handleAddToCart(product: any) {
    this.cartService
      .addToCart({
        productId: product.productId,
        quantity: 1, // Default to 1 for now
        price: product.price,
        title: product.title, // New Field
        image: product.image, // New Field
      })
      .subscribe({
        next: () => {
          this.handleRemoveFromWishlist(product);
          console.log(`Added ${product.title} to the cart!`);
        },
        error: (err: any) =>
          console.error('Failed to add wish-item to cart', err),
      });
  }

  handleRemoveFromWishlist(item: any) {
    this.wishListService.removeFromWishlist(item.productId).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(
          (i) => i.productId !== item.productId
        );
      },
      error: (err) => console.error('Failed to remove item from wishlist', err),
    });
  }
}
