import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private baseUrl = `${environment.apiBaseUrl}/api/Wishlist`;

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  private getUserIdOrThrow(): string {
    const userId = this.accountService.getUserId();
    if (!userId) {
      throw new Error('User is not logged in.');
    }
    return userId;
  }

  getWishlist(): Observable<{ items: any[] }> {
    const userId = this.getUserIdOrThrow();
    return this.http.get<{ items: any[] }>(`${this.baseUrl}/${userId}`);
  }

  addToWishlist(wishlistItem: {
    productId: number;
    title: string;
    image: string;
  }): Observable<any> {
    const userId = this.getUserIdOrThrow();
    return this.http.post(`${this.baseUrl}/${userId}/add`, wishlistItem);
  }

  removeFromWishlist(productId: number): Observable<any> {
    const userId = this.getUserIdOrThrow();
    return this.http.delete(`${this.baseUrl}/${userId}/remove/${productId}`);
  }
}
