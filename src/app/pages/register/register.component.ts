import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="text-center">
      <h2 class="text-2xl font-bold text-blue-600">Sign up</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4 mt-6">
        <input
          class="w-full px-4 py-2 border rounded-md"
          placeholder="First Name"
          formControlName="firstName"
        />
        <input
          class="w-full px-4 py-2 border rounded-md"
          placeholder="Last Name"
          formControlName="lastName"
        />
        <input
          class="w-full px-4 py-2 border rounded-md"
          placeholder="Username"
          formControlName="username"
        />
        <input
          class="w-full px-4 py-2 border rounded-md"
          placeholder="Email"
          formControlName="email"
        />
        <input
          class="w-full px-4 py-2 border rounded-md"
          placeholder="Password"
          formControlName="password"
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  `,
})
export class RegisterComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: AccountService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.service.signUp(this.form.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Registration failed:', err);
        },
      });
    }
  }
}
