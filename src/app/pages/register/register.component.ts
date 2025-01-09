import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { FirstKeyPipe } from '../../pipes/first-key.pipe';
import { AccountService } from '../../services/account.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FirstKeyPipe],
  template: `
    <div class="text-center">
      <div class="mb-6 text-center">
        <button
          class="text-lg font-semibold hover:underline"
          (click)="navigateTo('/')"
        >
          MyStore
        </button>
        <h2 class="text-2xl font-bold text-blue-600">Sign up</h2>
        <p class="mt-2 text-sm text-gray-600">
          Don't have an account?
          <a
            (click)="navigateTo('/login')"
            class="text-blue-600 hover:underline font-medium"
          >
            Sign in
          </a>
        </p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <input
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="First Name"
            formControlName="firstName"
          />
          <div
            class="text-sm text-red-500 mt-1"
            *ngIf="hasDisplayableError('firstName')"
          >
            Please enter your first name.
          </div>
        </div>
        <div>
          <input
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Last Name"
            formControlName="lastName"
          />
          <div
            class="text-sm text-red-500 mt-1"
            *ngIf="hasDisplayableError('lastName')"
          >
            Please enter your last name.
          </div>
        </div>
        <div>
          <input
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
            formControlName="username"
          />
          <div
            class="text-sm text-red-500 mt-1"
            *ngIf="hasDisplayableError('username')"
          >
            Please enter your username.
          </div>
        </div>
        <div>
          <input
            type="tel"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone Number"
            formControlName="phoneNumber"
          />
          <div
            class="text-sm text-red-500 mt-1"
            *ngIf="hasDisplayableError('phoneNumber')"
          >
            Please enter your phone number.
          </div>
        </div>
        <div>
          <input
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            formControlName="email"
          />
          <div
            class="text-sm text-red-500 mt-1"
            *ngIf="hasDisplayableError('email')"
          >
            <div *ngIf="form.controls['email'].hasError('required')">
              Please enter your email address.
            </div>
            <div *ngIf="form.controls['email'].hasError('email')">
              Please enter a valid email address.
            </div>
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
            *ngIf="hasDisplayableError('password')"
          >
            <ng-container
              [ngSwitch]="form.controls['password'].errors | firstKey"
            >
              <div *ngSwitchCase="'required'">Please enter your password.</div>
              <div *ngSwitchCase="'minlength'">
                At least 6 characters required.
              </div>
              <div *ngSwitchCase="'pattern'">
                One or more special character(s).
              </div>
            </ng-container>
          </div>
        </div>
        <div>
          <input
            type="password"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
            formControlName="confirmPassword"
          />
          <div
            class="text-sm text-red-500 mt-1"
            *ngIf="
              hasDisplayableError('confirmPassword') &&
              form.controls['confirmPassword'].hasError('passwordMismatch')
            "
          >
            Passwords don't match.
          </div>
        </div>
        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  `,
})
export class RegisterComponent {
  form: FormGroup;
  isSubmitted: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private service: AccountService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.form = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        username: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/),
          ],
        ],
        confirmPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(/(?=.*[^a-zA-Z0-9 ])/),
          ],
        ],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    if (this.service.isLoggedIn()) {
      this.router.navigateByUrl('/store/products');
    }
  }

  passwordMatchValidator: ValidatorFn = (
    group: AbstractControl
  ): { [key: string]: any } | null => {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  };

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
      this.service.signUp(this.form.value).subscribe({
        next: () => {
          this.toastService.showToast({
            message: 'Registration successful! Please log in.',
            type: 'success',
          });
          console.log(
            'Toast triggered: Registration successful! Please log in!'
          );

          this.router.navigateByUrl('/login');
        },
        error: (err: any) => {
          this.toastService.showToast({
            message: 'Registration failed. Please try again.',
            type: 'error',
          });
          console.error('Registration error:', err);
          console.log(
            'Toast triggered: Registration failed. Please try again!'
          );
        },
      });
    } else {
      this.toastService.showToast({
        message: 'Please fill in all required fields.',
        type: 'warning',
      });
      console.log('Toast triggered: Please fill in all required fields!');
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
