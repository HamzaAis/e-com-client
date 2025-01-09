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
    <div class="mb-6 text-center">
      <button
        class="text-lg font-semibold hover:underline"
        (click)="navigateTo('/')"
      >
        MyStore
      </button>
      <h2 class="text-2xl font-bold text-blue-600">Sign in</h2>
      <p class="mt-2 text-sm text-gray-600">
        Don't have an account?
        <a
          (click)="navigateTo('/register')"
          class="text-blue-600 hover:underline font-medium"
        >
          Sign up
        </a>
      </p>
    </div>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <input
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="username"
          formControlName="username"
        />
        <div
          class="text-sm text-red-500 mt-1"
          *ngIf="
            hasDisplayableError('username') &&
            form.controls['username'].hasError('required')
          "
        >
          Please enter your username address.
        </div>
      </div>
      <div>
        <input
          type="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          formControlName="password"
        />
        <div
          class="text-sm text-red-500 mt-1"
          *ngIf="
            hasDisplayableError('password') &&
            form.controls['password'].hasError('required')
          "
        >
          Please enter your password.
        </div>
      </div>
      <div class="mt-6">
        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign in
        </button>
      </div>
    </form>
  `,
  styles: [],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isSubmitted: boolean = false;

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
      this.service.signIn(this.form.value).subscribe({
        next: (res: any) => {
          this.service.saveToken(res.accessToken);

          // Trigger the toast notification
          const username = this.service.getUsername();
          const userId = this.service.getUserId();
          if (username && userId) {
            this.toastService.showToast({
              message: `Logged in as ${username} (ID: ${userId}).`,
              type: 'success',
            });
          }

          this.router.navigateByUrl('/');
        },
        error: (err: any) => {
          this.toastService.showToast({
            message: 'Login failed. Please check your credentials.',
            type: 'error',
          });
          console.error('Login error:', err);
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
