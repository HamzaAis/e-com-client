import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private accountService: AccountService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    if (!expectedRole) return true; // allow if no role specified
    if (
      !this.accountService.isLoggedIn() ||
      !this.accountService.isInRole(expectedRole)
    ) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }
}
