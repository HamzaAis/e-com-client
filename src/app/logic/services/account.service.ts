import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TOKEN_KEY } from '../constants';

import { CallServerService } from './call-server.service';

import { AuthResponseDto } from '../interfaces/AuthResponseDto';
import { LoginRequest } from '../interfaces/LoginRequest';
import { RefreshTokenRequest } from '../interfaces/RefreshTokenRequest';
import { RegisterRequest } from '../interfaces/RegisterRequest';
import { UserInfo } from '../interfaces/UserInfo';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.checkTokenValidity()
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userInfoSubject = new BehaviorSubject<UserInfo>({
    userId: null,
    username: null,
    roles: [],
  });
  userInfo$ = this.userInfoSubject.asObservable();

  constructor(private callServer: CallServerService) {
    this.initializeUserInfo();
  }

  signUp(formData: RegisterRequest): Observable<AuthResponseDto> {
    return this.callServer.post<AuthResponseDto>(
      '/api/Account/register',
      formData
    );
  }

  signIn(formData: LoginRequest): Observable<AuthResponseDto> {
    return this.callServer
      .post<AuthResponseDto>('/api/Account/login', formData)
      .pipe(
        tap((response) => {
          if (response.token?.accessToken) {
            this.saveToken(response.token.accessToken);
          }
        })
      );
  }

  refreshToken(req: RefreshTokenRequest): Observable<AuthResponseDto> {
    return this.callServer
      .post<AuthResponseDto>('/api/Account/refresh-token', req)
      .pipe(
        tap((response) => {
          if (response.token?.accessToken) {
            this.saveToken(response.token.accessToken);
          }
        })
      );
  }

  saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this.isLoggedInSubject.next(true);
    this.initializeUserInfo();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  deleteToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedInSubject.next(false);
    this.userInfoSubject.next({ userId: null, username: null, roles: [] });
  }

  private checkTokenValidity(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp && Date.now() / 1000 > decoded.exp) {
        this.deleteToken();
        return false;
      }
      return true;
    } catch {
      this.deleteToken();
      return false;
    }
  }

  private decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid JWT:', error);
      return null;
    }
  }

  private initializeUserInfo(): void {
    const decoded: any = this.decodeToken();
    if (decoded) {
      const rolesSet = new Set<string>();
      // Standard JWT or ASP.NET style
      if (decoded.role) {
        if (Array.isArray(decoded.role))
          decoded.role.forEach((r: string) => rolesSet.add(r));
        else rolesSet.add(decoded.role);
      }
      if (
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      ) {
        const claimRoles =
          decoded[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];
        if (Array.isArray(claimRoles))
          claimRoles.forEach((r: string) => rolesSet.add(r));
        else rolesSet.add(claimRoles);
      }
      this.userInfoSubject.next({
        userId: decoded.sub ?? decoded['nameid'] ?? null,
        username: decoded.username ?? null,
        roles: Array.from(rolesSet),
      });
    } else {
      this.userInfoSubject.next({ userId: null, username: null, roles: [] });
    }
  }

  getUserId(): string | null {
    return this.userInfoSubject.getValue().userId;
  }

  getUsername(): string | null {
    return this.userInfoSubject.getValue().username;
  }

  getRoles(): string[] {
    return this.userInfoSubject.getValue().roles;
  }

  isInRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  // isLoggedIn(): boolean {
  //   return this.checkTokenValidity();
  // }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      // JWT exp is in seconds
      if (decoded.exp && Date.now() / 1000 > decoded.exp) {
        this.deleteToken();
        return false;
      }
      return true;
    } catch {
      this.deleteToken();
      return false;
    }
  }
}
