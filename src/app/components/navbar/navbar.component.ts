import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <nav
      class="flex items-center justify-between px-6 py-4 bg-blue-500 text-white sticky top-0 z-10"
    >
      <!-- Store Name -->
      <button
        class="text-lg font-semibold hover:underline"
        (click)="navigateTo('/')"
      >
        MyStore
      </button>

      <!-- Navigation Links -->
      <ul class="flex items-center space-x-6">
        <!-- Conditional Links -->
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
  isLoggedIn: boolean = false;

  constructor(
    private accountService: AccountService,
    private toastService: ToastService,
    private router: Router
  ) {
    // Subscribe to login state
    this.accountService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.accountService.deleteToken();
    this.toastService.showToast({
      message: 'Logged out successfully.',
      type: 'info',
    });
    console.log('Toast triggered: Logged out successfully!');

    this.router.navigate(['/']);
  }
}
