import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TOKEN_KEY } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private baseUrl = `${environment.apiBaseUrl}/api/Account`;

  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.getToken() !== null
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private userId: string | null = null; // To store the decoded user ID
  private username: string | null = null; // To store the decoded username
  private userDetailsSubject = new BehaviorSubject<{
    userId: string | null;
    username: string | null;
  }>({
    userId: this.getUserId(),
    username: this.getUsername(),
  });
  userDetails$ = this.userDetailsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeUserDetails();
  }

  signUp(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, formData);
  }

  signIn(formData: any): Observable<any> {
    return this.http
      .post<{ accessToken: string; refreshToken: string }>(
        `${this.baseUrl}/login`,
        formData
      )
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
          this.saveToken(response.accessToken); // Match key sent from backend
        })
      );
  }

  refreshToken(refreshTokenRequest: {
    accessToken: string;
    refreshToken: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/refresh-token`, refreshTokenRequest);
  }

  saveToken(token: string): void {
    console.log('Saving token:', token);
    if (!token) {
      console.error('No token provided to saveToken');
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    this.isLoggedInSubject.next(true);
    this.initializeUserDetails();
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  deleteToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedInSubject.next(false);
    this.clearUserDetails();
  }

  private decodeToken(): any {
    const token = this.getToken();
    if (!token) {
      console.error('Token is undefined or null in decodeToken');
      return null;
    }
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid JWT token:', error);
      return null;
    }
  }

  private initializeUserDetails(): void {
    const decodedToken = this.decodeToken();
    if (decodedToken) {
      // Adjusted to match the simplified backend JWT structure
      this.userId = decodedToken.sub || null; // `sub` contains the user ID
      this.username = decodedToken.userId || null; // `userId` contains the username
    } else {
      this.clearUserDetails();
    }
    this.updateUserDetailsSubject();
  }

  private clearUserDetails(): void {
    this.userId = null;
    this.username = null;
    this.updateUserDetailsSubject();
  }

  private updateUserDetailsSubject(): void {
    this.userDetailsSubject.next({
      userId: this.userId,
      username: this.username,
    });
  }

  getUserId(): string | null {
    return this.userId;
  }

  getUsername(): string | null {
    return this.username;
  }
}
