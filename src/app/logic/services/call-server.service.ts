import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class CallServerService {
  private apiBase = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  get<T>(url: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null)
          httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http
      .get<T>(`${this.apiBase}${url}`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http
      .post<T>(`${this.apiBase}${url}`, body)
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, body?: any, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null)
          httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http
      .put<T>(`${this.apiBase}${url}`, body, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string): Observable<T> {
    return this.http
      .delete<T>(`${this.apiBase}${url}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    // For production: show toast/snackbar here if desired
    console.error('API error:', error);
    return throwError(error);
  }
}
