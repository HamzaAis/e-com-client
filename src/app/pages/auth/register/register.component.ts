import { Component } from '@angular/core';
import { RegisterCardComponent } from './register-card/register-card.component';

@Component({
  selector: 'app-register',
  imports: [RegisterCardComponent],
  template: `
    <app-register-card />
  `,
  styles: ``,
})
export class RegisterComponent {}
