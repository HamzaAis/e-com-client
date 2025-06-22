import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { CartComponent } from './components/pages/store/cart/cart.component';
import { ProductsComponent } from './components/pages/store/products/products.component';
import { WishlistComponent } from './components/pages/store/wishlist/wishlist.component';
import { AuthGuard } from './logic/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'store',
    canActivate: [AuthGuard], // Only AuthGuard for now
    children: [
      { path: 'products', component: ProductsComponent },
      { path: 'search', component: ProductsComponent },
      { path: 'cart', component: CartComponent },
      { path: 'wishlist', component: WishlistComponent },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
