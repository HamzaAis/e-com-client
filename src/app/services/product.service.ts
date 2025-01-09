import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiBaseUrl}/api/Products`;

  constructor(private http: HttpClient) {}

  getProducts(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sort?: string;
    order?: string;
  }): Observable<any> {
    return this.http.get(this.baseUrl, { params });
  }

  getProduct(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }
}
