import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductDto } from '../../../../logic/interfaces/ProductDto';
import { CartService } from '../../../../logic/services/cart.service';
import { ProductService } from '../../../../logic/services/product.service';
import { ToastService } from '../../../../logic/services/toast.service';
import { CardComponent } from '../../../shared/card/card.component';
import { WishlistService } from '../../../../logic/services/wish-list.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CardComponent, FormsModule],
  template: `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">Products</h1>
      <div class="mb-6">
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (input)="onSearchInput()"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Search products..."
        />
      </div>
      <div *ngIf="isLoading" class="text-center py-12">
        <p class="text-gray-500">Loading products...</p>
      </div>
      <ng-container *ngIf="!isLoading">
        <div
          *ngIf="products.length; else emptyProducts"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <app-card
            *ngFor="let product of products"
            [title]="product.title"
            [image]="product.image"
            [price]="product.price"
            [stock]="product.stock"
            (addToCart)="handleAddToCart(product)"
            (addToWishlist)="handleAddToWishlist(product)"
          ></app-card>
        </div>
        <ng-template #emptyProducts>
          <div class="text-center py-12">
            <p class="text-gray-500">No products found.</p>
          </div>
        </ng-template>
      </ng-container>
    </div>
  `,
  styles: [],
})
export class ProductsComponent implements OnInit {
  products: ProductDto[] = [];
  searchQuery = '';
  isLoading = false;

  constructor(
    private productService: ProductService,
    private toastService: ToastService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts({ search: this.searchQuery }).subscribe({
      next: (res) => {
        this.products = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.toastService.showToast({
          message: 'Failed to load products.',
          type: 'error',
        });
        this.isLoading = false;
      },
    });
  }

  onSearchInput() {
    this.loadProducts();
  }

  handleAddToCart(product: ProductDto) {
    this.cartService
      .addToCart({
        productId: product.id,
        quantity: 1,
        price: product.price,
        title: product.title,
        image: product.image,
      })
      .subscribe({
        next: () => {
          this.toastService.showToast({
            message: `${product.title} added to the cart!`,
            type: 'success',
          });
        },
        error: (err) => {
          console.error('Failed to add to cart', err);
          this.toastService.showToast({
            message: `Failed to add ${product.title} to the cart.`,
            type: 'error',
          });
        },
      });
  }

  handleAddToWishlist(product: ProductDto) {
    this.wishlistService
      .addToWishlist({
        productId: product.id,
        title: product.title,
        image: product.image,
        price: product.price,
        stock: product.stock,
      })
      .subscribe({
        next: () => {
          this.toastService.showToast({
            message: `${product.title} added to the wishlist!`,
            type: 'success',
          });
        },
        error: (err) => {
          console.error('Failed to add to wishlist', err);
          this.toastService.showToast({
            message: `Failed to add ${product.title} to the wishlist.`,
            type: 'error',
          });
        },
      });
  }
}
