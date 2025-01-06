import { Component } from '@angular/core';
import { LoginCardComponent } from '../login/login-card/login-card.component';

@Component({
  selector: 'app-login',
  imports: [LoginCardComponent],
  template: `
    <app-login-card />
  `,
  styles: ``,
})
export class LoginComponent {}
