import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../logic/interfaces/LoginRequest';
import { AccountService } from '../../../logic/services/account.service';
import { ToastService } from '../../../logic/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div class="text-center mb-6">
          <h1
            class="text-2xl font-bold text-blue-600 hover:underline"
            (click)="navigateTo('/')"
          >
            MyStore
          </h1>
          <h2 class="text-3xl font-semibold text-gray-800 mt-4">Sign In</h2>
          <p class="mt-2 text-sm text-gray-600">
            Don't have an account?
            <a
              class="text-blue-600 hover:underline font-medium"
              (click)="navigateTo('/register')"
            >
              Sign Up
            </a>
          </p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Username Field -->
          <div class="relative">
            <label for="username" class="block text-gray-700 font-medium"
              >Username</label
            >
            <input
              id="username"
              formControlName="username"
              class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
            <div
              *ngIf="hasDisplayableError('username')"
              class="text-sm text-red-500 mt-1"
            >
              Please enter your username.
            </div>
          </div>

          <!-- Password Field -->
          <div class="relative">
            <label for="password" class="block text-gray-700 font-medium"
              >Password</label
            >
            <div class="relative">
              <input
                id="password"
                [type]="isPasswordVisible ? 'text' : 'password'"
                formControlName="password"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
              >
                <span class="material-icons">
                  {{ isPasswordVisible ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            <div
              *ngIf="hasDisplayableError('password')"
              class="text-sm text-red-500 mt-1"
            >
              Please enter your password.
            </div>
          </div>

          <!-- Forgot Password Link -->
          <div class="text-right">
            <a
              class="text-blue-600 hover:underline text-sm"
              (click)="navigateTo('/forgot-password')"
            >
              Forgot Password?
            </a>
          </div>

          <!-- Sign-In Button -->
          <div class="mt-6">
            <button
              type="submit"
              [disabled]="form.invalid || isSubmitting"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span *ngIf="!isSubmitting">Sign In</span>
              <span *ngIf="isSubmitting">Signing in...</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  isPasswordVisible = false;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.accountService.isLoggedIn()) {
      this.router.navigateByUrl('/');
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  hasDisplayableError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return (
      Boolean(control?.invalid) &&
      (this.isSubmitted || Boolean(control?.touched) || Boolean(control?.dirty))
    );
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.isSubmitting = true;
      const loginRequest: LoginRequest = this.form.value;
      this.accountService.signIn(loginRequest).subscribe({
        next: (res) => {
          if (res.isSuccess && res.token?.accessToken) {
            this.accountService.saveToken(res.token.accessToken);
            this.toastService.showToast({
              message: 'Logged in successfully!',
              type: 'success',
            });
            setTimeout(() => this.router.navigateByUrl('/'), 0);
          } else {
            this.toastService.showToast({
              message:
                res.errors?.join(', ') ||
                'Login failed. Please check your credentials.',
              type: 'error',
            });
          }
        },
        error: (err: any) => {
          this.toastService.showToast({
            message: 'Login failed. Please check your credentials.',
            type: 'error',
          });
          console.error('Login error:', err);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.toastService.showToast({
        message: 'Please fill in all required fields.',
        type: 'warning',
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
