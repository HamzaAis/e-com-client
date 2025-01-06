import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductsListComponent } from './pages/products-list/products-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'store',
    children: [
      {
        path: 'products',
        component: ProductsListComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
    ],
  },
];
