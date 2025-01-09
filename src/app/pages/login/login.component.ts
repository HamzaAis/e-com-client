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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<div class="mb-6 text-center">
      <h2 class="text-2xl font-bold text-green-600">Sign in</h2>
      <p class="mt-2 text-sm text-gray-600">
        Don't have an account?
        <a
          routerLink="/register"
          class="text-green-600 hover:underline font-medium"
        >
          Sign up
        </a>
      </p>
    </div>
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
      <div>
        <input
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
          class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Sign in
        </button>
      </div>
    </form>`,
  styles: ``,
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder, // Changed to private for consistency
    private service: AccountService,
    private router: Router
  ) {
    // Initialize the form here
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.service.isLoggedIn()) {
      this.router.navigateByUrl('/store/products');
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
          console.log('Login success, response:', res);
          this.service.saveToken(res.accessToken); // Ensure this matches the backend key
          this.router.navigateByUrl('');
        },
        error: (err: any) => {
          console.error('Login failed:', err);
        },
      });
    }
  }
}
