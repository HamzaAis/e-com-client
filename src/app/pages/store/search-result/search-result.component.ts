import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Search Header -->
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          Search Results for "<span class="text-blue-600">{{
            searchQuery
          }}</span
          >"
        </h2>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="text-red-500 mb-4">
          {{ errorMessage }}
        </div>

        <!-- Filters -->
        <div class="flex items-center space-x-4 mb-6">
          <label>
            Sort by:
            <select
              [(ngModel)]="sort"
              (change)="fetchSearchResults()"
              class="px-4 py-2 rounded-md"
            >
              <option value="title">Title</option>
              <option value="price">Price</option>
              <option value="stock">Stock</option>
            </select>
          </label>
          <label>
            Order:
            <select
              [(ngModel)]="order"
              (change)="fetchSearchResults()"
              class="px-4 py-2 rounded-md"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>

        <!-- Loading Skeleton -->
        <div
          *ngIf="isLoading"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            *ngFor="let loader of skeletonLoaders"
            class="bg-gray-200 h-60 rounded-md"
          ></div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isLoading && products.length === 0" class="text-gray-500">
          No products found matching "<span class="font-semibold">{{
            searchQuery
          }}</span
          >".
        </div>

        <!-- Product List -->
        <div
          *ngIf="!isLoading && products.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <div
            *ngFor="let product of products"
            class="bg-white border rounded-lg p-4 shadow hover:shadow-lg"
          >
            <img
              [src]="product.image || 'https://via.placeholder.com/150'"
              alt="{{ product.title }}"
              class="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h3 class="text-lg font-medium text-gray-700 truncate">
              {{ product.title }}
            </h3>
            <p class="text-gray-600 text-sm mb-2 truncate">
              {{ product.description }}
            </p>
            <p class="text-blue-600 font-semibold mb-2">
              \${{ product.price }}
            </p>
            <button
              class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              (click)="viewProduct(product.id)"
            >
              View Details
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-6 flex justify-center">
          <button
            *ngIf="page > 1"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
            (click)="changePage(page - 1)"
          >
            Previous
          </button>
          <button
            *ngIf="products.length === pageSize"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            (click)="changePage(page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class SearchResultComponent implements OnInit {
  searchQuery: string = '';
  products: any[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  page: number = 1;
  pageSize: number = 10;
  sort: string = 'price';
  order: string = 'asc';

  skeletonLoaders: number[] = Array(8).fill(0);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'] || '';
      this.page = 1;
      this.errorMessage = null;
      this.fetchSearchResults();
    });
  }

  fetchSearchResults(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.productService
      .getProducts({
        search: this.searchQuery,
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sort,
        order: this.order,
      })
      .subscribe({
        next: (res) => {
          this.products = res.data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMessage =
            'An error occurred while fetching search results.';
          this.isLoading = false;
        },
      });
  }

  changePage(newPage: number): void {
    this.page = newPage;
    this.fetchSearchResults();
  }

  viewProduct(productId: number): void {
    this.router.navigate(['/store/products', productId]);
  }
}
