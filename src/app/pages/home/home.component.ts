import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-gray-50 min-h-screen">
      <!-- Hero Section -->
      <section
        class="bg-blue-500 text-white py-12 px-6 md:px-20 text-center flex flex-col items-center"
      >
        <p *ngIf="username && userId" class="mt-4">
          Logged in as <strong>{{ username }}</strong> (ID: {{ userId }})
        </p>
        <p *ngIf="!username">You are not logged in.</p>

        <p class="text-lg mb-6">
          Discover the best products at unbeatable prices.
        </p>
        <button
          class="bg-white text-blue-500 px-6 py-2 rounded-md hover:bg-gray-100"
          routerLink="/store/products"
        >
          Shop Now
        </button>
      </section>

      <!-- Categories Section -->
      <section class="py-12 px-6 md:px-20">
        <h2 class="text-2xl font-bold text-center mb-6">Shop by Category</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg"
          >
            <img
              src="https://via.placeholder.com/300x200"
              alt="Category 1"
              class="w-full h-40 object-cover"
            />
            <div class="p-4 text-center">
              <h3 class="font-bold text-lg">Electronics</h3>
              <button
                class="mt-2 text-blue-500 hover:underline"
                routerLink="/store/products"
              >
                Explore
              </button>
            </div>
          </div>
          <div
            class="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg"
          >
            <img
              src="https://via.placeholder.com/300x200"
              alt="Category 2"
              class="w-full h-40 object-cover"
            />
            <div class="p-4 text-center">
              <h3 class="font-bold text-lg">Fashion</h3>
              <button
                class="mt-2 text-blue-500 hover:underline"
                routerLink="/store/products"
              >
                Explore
              </button>
            </div>
          </div>
          <div
            class="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg"
          >
            <img
              src="https://via.placeholder.com/300x200"
              alt="Category 3"
              class="w-full h-40 object-cover"
            />
            <div class="p-4 text-center">
              <h3 class="font-bold text-lg">Home Appliances</h3>
              <button
                class="mt-2 text-blue-500 hover:underline"
                routerLink="/store/products"
              >
                Explore
              </button>
            </div>
          </div>
          <div
            class="bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg"
          >
            <img
              src="https://via.placeholder.com/300x200"
              alt="Category 4"
              class="w-full h-40 object-cover"
            />
            <div class="p-4 text-center">
              <h3 class="font-bold text-lg">Sports</h3>
              <button
                class="mt-2 text-blue-500 hover:underline"
                routerLink="/store/products"
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
export class HomeComponent {
  username: string | null = null;
  userId: string | null = null;

  constructor(private accountService: AccountService) {
    this.username = this.accountService.getUsername();
    this.userId = this.accountService.getUserId();
  }
}
