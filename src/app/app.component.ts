import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',

  imports: [
    RouterOutlet,
    ToastComponent,
    NavbarComponent,
    FooterComponent,
    CommonModule,
  ],
  template: `
    <app-navbar *ngIf="showNavbar"></app-navbar>
    <app-toast />
    <router-outlet></router-outlet>
    <app-footer *ngIf="showFooter"></app-footer>
  `,
  styles: [],
})
export class AppComponent {
  get showNavbar(): boolean {
    return !['/login', '/register'].includes(window.location.pathname);
  }

  get showFooter(): boolean {
    return !['/login', '/register'].includes(window.location.pathname);
  }
}
