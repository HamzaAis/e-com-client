import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { PrimaryButtonComponent } from '../primary-button/primary-button.component';

@Component({
  selector: 'app-header',
  imports: [PrimaryButtonComponent, RouterLink, CommonModule, NgIf],
  template: `
    <div
      class="bg-slate-100 px-4 py-3 shadow-md flex justify-between items-center"
    >
      <button class="text-2xl" routerLink="/store/products">My Store</button>
      <div class="flex gap-4 items-center">
        <!-- Conditional Links Based on Login Status -->
        <ng-container *ngIf="isLoggedIn; else guestLinks">
          <app-primary-button
            label="{{ cartLabel() }}"
            routerLink="/store/cart"
          ></app-primary-button>
          <button class="hover:underline text-red-600" (click)="logout()">
            Logout
          </button>
        </ng-container>
        <ng-template #guestLinks>
          <button routerLink="/login" class="hover:underline">Login</button>
          <button routerLink="/register" class="hover:underline">
            Register
          </button>
        </ng-template>
      </div>
    </div>
  `,
  styles: ``,
})
export class HeaderComponent implements OnInit {
  cartService = inject(CartService);
  authService = inject(AuthService);
  router = inject(Router);

  isLoggedIn: boolean = false;

  cartLabel = () => `Cart (${this.cartService.cart().length})`;

  ngOnInit() {
    // Subscribe to login state
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });
  }

  logout() {
    // Logout logic
    this.authService.deleteToken();
    this.router.navigateByUrl('/login');
  }
}
