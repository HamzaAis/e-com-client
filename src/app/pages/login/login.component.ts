import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div class="text-center mb-6">
          <button
            class="text-2xl font-bold text-blue-600 hover:underline"
            (click)="navigateTo('/')"
          >
            MyStore
          </button>
          <h2 class="text-3xl font-semibold text-gray-800">Sign In</h2>
          <p class="mt-2 text-sm text-gray-600">
            Don't have an account?
            <a
              (click)="navigateTo('/register')"
              class="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Username Field -->
          <div class="relative mb-4">
            <label for="username" class="block text-gray-700 font-medium"
              >Username</label
            >
            <input
              id="username"
              formControlName="username"
              (keyup.enter)="autoFocusNextOrSubmit('password')"
              class="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
            />
            <!-- Success Icon -->
            <svg
              *ngIf="form.get('username')?.valid"
              class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <!-- Error Icon -->
            <svg
              *ngIf="
                form.get('username')?.invalid && form.get('username')?.touched
              "
              class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <div
              class="text-sm text-red-500 mt-1"
              *ngIf="hasDisplayableError('username')"
            >
              Please enter your username.
            </div>
          </div>

          <!-- Password Field -->
          <div class="relative">
            <label for="password" class="block text-gray-700 font-medium"
              >Password</label
            >
            <input
              id="password"
              [type]="isPasswordVisible ? 'text' : 'password'"
              formControlName="password"
              (keyup.enter)="autoFocusNextOrSubmit()"
              class="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
            <!-- Password Visibility Toggle -->
            <button
              type="button"
              (click)="togglePasswordVisibility()"
              class="absolute inset-y-0 top-12 right-2 flex items-center h-5 w-5 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <svg
                *ngIf="isPasswordVisible"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.729 2.197-2.497 3.999-4.582 4.995"
                />
              </svg>
              <svg
                *ngIf="!isPasswordVisible"
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825c-.49.387-.977.718-1.49.974C12 20 10.886 20.022 9.18 19.973c-1.804-.048-2.91-.022-3.705-.192-1.174-.248-1.648-.6-1.97-.933a3.826 3.826 0 01-.693-.973c-.3-.73-.307-1.682-.308-2.812.002-1.13-.013-2.083.285-2.812a3.826 3.826 0 01.693-.972c.322-.334.796-.685 1.97-.933.796-.17 1.901-.144 3.705-.192 1.707-.048 2.821-.022 3.38-.026.534-.004.91.113 1.084.246.33.252.52.715.867 1.565.362.89.64 1.91.74 2.52"
                />
              </svg>
            </button>
            <div
              class="text-sm text-red-500 mt-1"
              *ngIf="hasDisplayableError('password')"
            >
              Please enter your password.
            </div>
          </div>

          <!-- Sign-In Button -->
          <div class="mt-6">
            <button
              type="submit"
              [disabled]="form.invalid || isSubmitting"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span *ngIf="isSubmitting">Signing in...</span>
              <span *ngIf="!isSubmitting">Sign In</span>
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
  isSubmitted: boolean = false;
  isPasswordVisible = false;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: AccountService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.service.isLoggedIn()) {
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

  autoFocusNextOrSubmit(nextFieldId?: string) {
    if (nextFieldId) {
      const nextField = document.getElementById(nextFieldId);
      nextField?.focus();
    } else {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.isSubmitting = true;
      this.service.signIn(this.form.value).subscribe({
        next: (res: any) => {
          this.service.saveToken(res.accessToken);
          this.toastService.showToast({
            message: 'Logged in successfully!',
            type: 'success',
          });
          this.router.navigateByUrl('/');
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
