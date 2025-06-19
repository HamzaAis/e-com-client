import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  template: `
    <nav
      class="flex items-center justify-between px-6 py-4 bg-blue-500 text-white sticky top-0 z-10"
    >
      <button
        class="text-lg font-semibold hover:underline"
        (click)="navigateTo('/')"
      >
        MyStore
      </button>
      <ul class="flex items-center space-x-6">
        <ng-container *ngIf="!isLoggedIn; else loggedInLinks">
          <li>
            <button class="hover:underline" (click)="navigateTo('/login')">
              Login
            </button>
          </li>
          <li>
            <button class="hover:underline" (click)="navigateTo('/register')">
              Register
            </button>
          </li>
        </ng-container>
        <ng-template #loggedInLinks>
          <div class="relative flex items-center">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              class="px-4 py-2 rounded-md text-black focus:ring-2 focus:ring-blue-300 focus:outline-none"
              placeholder="Search products..."
              (keyup)="onSearchInput()"
            />
            <button
              class="px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800 focus:outline-none ml-2"
              (click)="onSearch()"
            >
              Search
            </button>
            <button
              *ngIf="searchQuery"
              class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none ml-2"
              (click)="clearSearch()"
            >
              Clear
            </button>
            <div
              *ngIf="suggestions.length > 0 && showSuggestions"
              class="absolute top-12 left-0 w-full bg-white text-black rounded-lg shadow-lg max-h-48 overflow-y-auto z-20"
            >
              <ul>
                <li
                  *ngFor="let suggestion of suggestions"
                  class="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  (click)="selectSuggestion(suggestion)"
                >
                  {{ suggestion.title }}
                </li>
              </ul>
            </div>
          </div>
          <li>
            <button
              class="hover:underline"
              (click)="navigateTo('/store/products')"
            >
              Products
            </button>
          </li>
          <li>
            <button class="hover:underline" (click)="navigateTo('/store/cart')">
              Cart
            </button>
          </li>
          <li>
            <button
              class="hover:underline"
              (click)="navigateTo('/store/wishlist')"
            >
              Wishlist
            </button>
          </li>
          <li>
            <button class="hover:underline text-red-200" (click)="logout()">
              Logout
            </button>
          </li>
        </ng-template>
      </ul>
    </nav>
  `,
  styles: [],
})
export class NavbarComponent {
  searchQuery: string = '';
  suggestions: any[] = [];
  showSuggestions: boolean = false;
  searchSubject: Subject<string> = new Subject();

  isLoggedIn: boolean = false;

  constructor(
    private accountService: AccountService,
    private toastService: ToastService,
    private productService: ProductService,
    private router: Router
  ) {
    this.accountService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim()) {
          this.productService
            .getProducts({ search: query, pageSize: 5 })
            .subscribe((response: any) => {
              this.suggestions = response.data;
              this.showSuggestions = true;
            });
        } else {
          this.suggestions = [];
        }
      });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/store/search'], {
        queryParams: { q: this.searchQuery },
      });
      this.resetSuggestions();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.suggestions = [];
    this.showSuggestions = false;
  }

  selectSuggestion(product: any): void {
    this.router.navigate(['/store/products', product.id]);
    this.resetSuggestions();
  }

  resetSuggestions(): void {
    this.suggestions = [];
    this.showSuggestions = false;
    this.searchQuery = '';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout() {
    this.accountService.deleteToken();
    this.toastService.showToast({
      message: 'Logged out successfully.',
      type: 'info',
    });
    this.router.navigate(['/']);
  }
}
