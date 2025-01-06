import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { TOKEN_KEY } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    this.getToken() !== null
  );
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  createUser(formData: any) {
    return this.http.post(
      environment.apiBaseUrl + '/api/account/register',
      formData
    );
  }

  signin(formData: any) {
    return this.http.post(
      environment.apiBaseUrl + '/api/account/login',
      formData
    );
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.isLoggedInSubject.next(true); // Notify subscribers about login state change
  }

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  deleteToken() {
    localStorage.removeItem(TOKEN_KEY);
    this.isLoggedInSubject.next(false); // Notify subscribers about logout
  }
}
