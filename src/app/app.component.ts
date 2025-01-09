import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  template: `
    <app-navbar *ngIf="showNavbar"></app-navbar>
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
