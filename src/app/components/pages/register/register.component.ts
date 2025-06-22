import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../../logic/interfaces/RegisterRequest';
import { FirstKeyPipe } from '../../../logic/pipes/first-key.pipe';
import { AccountService } from '../../../logic/services/account.service';
import { ToastService } from '../../../logic/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FirstKeyPipe],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div class="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
        <div class="text-center mb-6">
          <button
            class="text-2xl font-bold text-blue-600 hover:underline"
            (click)="navigateTo('/')"
          >
            MyStore
          </button>
          <h2 class="text-3xl font-semibold text-gray-800">Sign Up</h2>
          <p class="mt-2 text-sm text-gray-600">
            Already have an account?
            <a
              class="text-blue-600 hover:underline font-medium"
              (click)="navigateTo('/login')"
            >
              Sign In
            </a>
          </p>
        </div>

        <!-- Step Indicators -->

        <div class="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div
            class="h-full bg-blue-600 rounded-full transition-all duration-300"
            [style.width]="progressPercentage"
          ></div>
        </div>

        <div class="flex justify-center mb-8 space-x-2">
          <span
            class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border border-blue-600"
            [class.bg-blue-600]="step === 1"
            [class.text-white]="step === 1"
          >
            1
          </span>
          <span
            class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border border-blue-600"
            [class.bg-blue-600]="step === 2"
            [class.text-white]="step === 2"
          >
            2
          </span>
          <span
            class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border border-blue-600"
            [class.bg-blue-600]="step === 3"
            [class.text-white]="step === 3"
          >
            3
          </span>
          <span
            class="w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold border border-blue-600"
            [class.bg-blue-600]="step === 4"
            [class.text-white]="step === 4"
          >
            4
          </span>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
          <ng-container *ngIf="step === 1">
            <div class="relative mb-4">
              <label for="firstName" class="block text-gray-700 font-medium"
                >First Name</label
              >
              <input
                id="firstName"
                formControlName="firstName"
                (keyup.enter)="autoFocusNextOrStep('lastName')"
                class="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                *ngIf="form.get('firstName')?.valid"
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-green-500 "
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
              <svg
                *ngIf="
                  form.get('firstName')?.invalid &&
                  form.get('firstName')?.touched
                "
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-red-500 "
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
                *ngIf="hasDisplayableError('firstName')"
                class="text-sm text-red-500 mt-1"
              >
                Please enter your first name.
              </div>
            </div>

            <div class="relative mb-4">
              <label for="lastName" class="block text-gray-700 font-medium"
                >Last Name</label
              >
              <input
                id="lastName"
                formControlName="lastName"
                (keyup.enter)="autoFocusNextOrStep('username')"
                class="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                *ngIf="form.get('lastName')?.valid"
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-green-500 "
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
              <svg
                *ngIf="
                  form.get('lastName')?.invalid && form.get('lastName')?.touched
                "
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-red-500 "
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
                *ngIf="hasDisplayableError('lastName')"
                class="text-sm text-red-500 mt-1"
              >
                Please enter your last name.
              </div>
            </div>

            <div class="relative mb-4">
              <label for="username" class="block text-gray-700 font-medium"
                >Username</label
              >
              <input
                id="username"
                formControlName="username"
                (keyup.enter)="autoFocusNextOrStep('phoneNumber', true)"
                class="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300
              rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                *ngIf="form.get('username')?.valid"
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-green-500 "
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
              <svg
                *ngIf="
                  form.get('username')?.invalid && form.get('username')?.touched
                "
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-red-500 "
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
                *ngIf="hasDisplayableError('username')"
                class="text-sm text-red-500 mt-1"
              >
                Please enter your username.
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="step === 2">
            <div class="relative mb-4">
              <label for="phoneNumber" class="block text-gray-700 font-medium"
                >Phone Number</label
              >
              <input
                id="phoneNumber"
                type="tel"
                formControlName="phoneNumber"
                (keyup.enter)="autoFocusNextOrStep('email')"
                class="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                *ngIf="form.get('phoneNumber')?.valid"
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-green-500 "
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
              <svg
                *ngIf="
                  form.get('phoneNumber')?.invalid &&
                  form.get('phoneNumber')?.touched
                "
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-red-500 "
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
                *ngIf="hasDisplayableError('phoneNumber')"
                class="text-sm text-red-500 mt-1"
              >
                Please enter your phone number.
              </div>
            </div>

            <div class="relative mb-4">
              <label for="email" class="block text-gray-700 font-medium"
                >Email</label
              >
              <input
                id="email"
                formControlName="email"
                (keyup.enter)="autoFocusNextOrStep('password', true)"
                class="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300
              rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                *ngIf="form.get('email')?.valid"
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-green-500 "
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
              <svg
                *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
                class="absolute inset-y-0 top-12 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-red-500 "
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
                *ngIf="hasDisplayableError('email')"
                class="text-sm text-red-500 mt-1"
              >
                <div *ngIf="form.get('email')?.hasError('required')">
                  Please enter your email address.
                </div>
                <div *ngIf="form.get('email')?.hasError('email')">
                  Please enter a valid email address.
                </div>
              </div>
            </div>
          </ng-container>

          <ng-container *ngIf="step === 3">
            <div class="relative">
              <div>
                <label for="password" class="block text-gray-700 font-medium"
                  >Password</label
                >
                <div
                  class="mt-2 flex items-center"
                  [ngClass]="passwordStrengthColor"
                >
                  <span class="text-sm font-medium">{{
                    passwordStrength
                  }}</span>
                </div>
                <input
                  id="password"
                  [type]="isPasswordVisible ? 'text' : 'password'"
                  formControlName="password"
                  (keyup.enter)="autoFocusNextOrStep('confirmPassword')"
                  class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <div
                  class="text-sm text-red-500 mt-1"
                  *ngIf="hasDisplayableError('password')"
                >
                  <div [ngSwitch]="form.controls['password'].errors | firstKey">
                    <div *ngSwitchCase="'required'">
                      Please enter your password.
                    </div>
                    <div *ngSwitchCase="'minlength'">
                      At least 6 characters required.
                    </div>
                    <div *ngSwitchCase="'pattern'">
                      One or more special character(s).
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 top-20 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-gray-700 "
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
              </div>
            </div>

            <div class="relative">
              <label
                for="confirmPassword"
                class="block text-gray-700 font-medium"
                >Confirm Password</label
              >
              <div
                class="mt-2 flex items-center"
                [ngClass]="confirmPasswordStrengthColor"
              >
                <span class="text-sm font-medium">{{
                  confirmPasswordStrength
                }}</span>
              </div>
              <input
                id="confirmPassword"
                [type]="isConfirmPasswordVisible ? 'text' : 'password'"
                formControlName="confirmPassword"
                (keyup.enter)="autoFocusNextOrStep('', true)"
                class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <div
                class="text-sm text-red-500 mt-1"
                *ngIf="hasDisplayableError('confirmPassword')"
              >
                <div
                  [ngSwitch]="
                    form.controls['confirmPassword'].errors | firstKey
                  "
                >
                  <div *ngSwitchCase="'required'">
                    Please enter your password.
                  </div>
                  <div *ngSwitchCase="'minlength'">
                    At least 6 characters required.
                  </div>
                  <div *ngSwitchCase="'pattern'">
                    One or more special character(s).
                  </div>
                </div>
              </div>
              <div
                class="text-sm text-red-500 mt-1"
                *ngIf="
                  hasDisplayableError('confirmPassword') &&
                  form.controls['confirmPassword'].hasError('passwordMismatch')
                "
              >
                Passwords do not match.
              </div>

              <button
                type="button"
                (click)="toggleConfirmPasswordVisibility()"
                class="absolute inset-y-0 top-20 right-2 flex items-center transform -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-gray-700 "
              >
                <svg
                  *ngIf="isConfirmPasswordVisible"
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
                  *ngIf="!isConfirmPasswordVisible"
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
            </div>
          </ng-container>

          <div class="flex justify-between mt-6">
            <button
              type="button"
              (click)="previousStep()"
              [disabled]="step === 1"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              (click)="nextStep()"
              *ngIf="step < 4"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
            <button
              type="submit"
              *ngIf="step === 4"
              [disabled]="form.invalid"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  step = 1;
  isLoading = false;

  isPasswordVisible = false;
  isConfirmPasswordVisible = false;
  passwordStrengthColor = '';
  confirmPasswordStrengthColor = '';

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
        phoneNumber: ['', [Validators.required, this.phoneNumberValidator()]],
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
      this.router.navigateByUrl('/');
    }
  }

  phoneNumberValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const phoneNumberPattern = /^[0-9]{10}$/;
      const isValid = phoneNumberPattern.test(control.value);
      return isValid ? null : { invalidPhoneNumber: true };
    };
  }

  autoFocusNextOrStep(fieldName: string, nextStep = false): void {
    if (nextStep) {
      this.nextStep();
      const firstControlOfNextStep = this.getControlsForStep(this.step)[0];
      if (firstControlOfNextStep) {
        const controlId = firstControlOfNextStep?.get('id')?.value;
        (document.getElementById(controlId) as HTMLInputElement)?.focus();
      }
    } else {
      const nextControl = this.form.get(fieldName);
      if (nextControl) {
        (document.getElementById(fieldName) as HTMLInputElement)?.focus();
      }
    }
  }

  get progressPercentage(): string {
    return `${(this.step / 4) * 100}%`;
  }

  get passwordStrength(): string {
    const password = this.form.get('password')?.value || '';
    if (password.length < 6) {
      this.passwordStrengthColor = 'text-red-500';
      return 'Weak';
    } else if (password.match(/(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/)) {
      this.passwordStrengthColor = 'text-green-500';
      return 'Strong';
    } else {
      this.passwordStrengthColor = 'text-yellow-500';
      return 'Moderate';
    }
  }

  get confirmPasswordStrength(): string {
    const password = this.form.get('confirmPassword')?.value || '';
    if (password.length < 6) {
      this.confirmPasswordStrengthColor = 'text-red-500';
      return 'Weak';
    } else if (password.match(/(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/)) {
      this.confirmPasswordStrengthColor = 'text-green-500';
      return 'Strong';
    } else {
      this.confirmPasswordStrengthColor = 'text-yellow-500';
      return 'Moderate';
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
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

  nextStep(): void {
    const controlsToValidate = this.getControlsForStep(this.step);
    controlsToValidate.forEach((control) => control.markAsTouched());
    const isStepValid = controlsToValidate.every((control) => control.valid);

    if (isStepValid) {
      this.step++;
    }
  }

  getControlsForStep(step: number): AbstractControl[] {
    switch (step) {
      case 1:
        return [
          this.form.get('firstName')!,
          this.form.get('lastName')!,
          this.form.get('username')!,
        ];
      case 2:
        return [this.form.get('phoneNumber')!, this.form.get('email')!];
      case 3:
        return [this.form.get('password')!, this.form.get('confirmPassword')!];
      default:
        return [];
    }
  }

  previousStep(): void {
    if (this.step > 1) {
      this.step--;
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.isLoading = true;
      const registerRequest: RegisterRequest = this.form.value;
      this.service.signUp(registerRequest).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.toastService.showToast({
              message: 'Registration successful! Please log in.',
              type: 'success',
            });
            this.router.navigateByUrl('/login');
          } else {
            this.toastService.showToast({
              message:
                res.errors?.join(', ') ||
                'Registration failed. Please try again.',
              type: 'error',
            });
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          this.toastService.showToast({
            message: 'Registration failed. Please try again.',
            type: 'error',
          });
          console.error('Registration error:', err);
        },
        complete: () => {
          this.isLoading = false;
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
