import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductDto } from '../../../logic/interfaces/ProductDto';
import { AccountService } from '../../../logic/services/account.service';
import { ProductService } from '../../../logic/services/product.service';
import { ToastService } from '../../../logic/services/toast.service';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Hero Section -->
      <section
        class="bg-blue-500 text-white py-20 px-6 md:px-20 text-center flex flex-col items-center"
      >
        <h1 class="text-4xl font-bold mb-4">Welcome to MyStore</h1>
        <p class="text-lg mb-6">
          Discover the best products at unbeatable prices.
        </p>
        <button
          class="bg-white text-blue-500 px-6 py-2 rounded-md hover:bg-gray-100 transition duration-300"
          routerLink="/store/products"
        >
          Shop Now
        </button>
      </section>

      <!-- Featured Products Section -->
      <section class="py-12 px-6 md:px-20">
        <h2 class="text-2xl font-bold text-center mb-6">Featured Products</h2>
        <div *ngIf="isLoading" class="text-center py-12">
          <p class="text-gray-500">Loading featured products...</p>
        </div>
        <div
          *ngIf="!isLoading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <app-card
            *ngFor="let product of featuredProducts"
            [title]="product.title"
            [image]="product.image"
            [price]="product.price"
            [stock]="product.stock"
            (addToCart)="handleAddToCart(product)"
            (addToWishlist)="handleAddToWishlist(product)"
          ></app-card>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="py-12 px-6 md:px-20">
        <h2 class="text-2xl font-bold text-center mb-6">Shop by Category</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            *ngFor="let category of categories"
            class="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition duration-300"
          >
            <img
              [src]="category.image"
              [alt]="category.name"
              class="w-full h-40 object-cover"
            />
            <div class="p-4 text-center">
              <h3 class="font-bold text-lg">{{ category.name }}</h3>
              <button
                class="mt-2 text-blue-500 hover:underline"
                [routerLink]="['/store/products']"
                [queryParams]="{ category: category.name }"
              >
                Explore
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export class HomeComponent implements OnInit {
  username: string | null = null;
  userId: string | null = null;
  featuredProducts: ProductDto[] = [];
  isLoading = false;

  categories = [
    { name: 'Electronics', image: 'https://via.placeholder.com/300x200' },
    { name: 'Fashion', image: 'https://via.placeholder.com/300x200' },
    { name: 'Home Appliances', image: 'https://via.placeholder.com/300x200' },
    { name: 'Sports', image: 'https://via.placeholder.com/300x200' },
  ];

  constructor(
    private accountService: AccountService,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.username = this.accountService.getUsername();
    this.userId = this.accountService.getUserId();
    this.loadFeaturedProducts();
  }

  loadFeaturedProducts() {
    this.isLoading = true;
    this.productService.getProducts({ pageSize: 4 }).subscribe({
      next: (products) => {
        // products is ProductDto[]
        this.featuredProducts = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.showToast({
          message: 'Failed to load featured products.',
          type: 'error',
        });
        this.isLoading = false;
      },
    });
  }

  handleAddToCart(product: ProductDto) {
    // TODO: Wire to CartService if desired
    this.toastService.showToast({
      message: `${product.title} added to the cart!`,
      type: 'success',
    });
  }

  handleAddToWishlist(product: ProductDto) {
    // TODO: Wire to WishlistService if desired
    this.toastService.showToast({
      message: `${product.title} added to the wishlist!`,
      type: 'success',
    });
  }
}
