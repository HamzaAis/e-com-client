import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { WishlistDto } from '../interfaces/WishlistDto';
import { WishlistItemDto } from '../interfaces/WishlistItemDto';
import { CallServerService } from './call-server.service';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  constructor(private callServer: CallServerService) {}

  getWishlist(): Observable<WishlistDto> {
    return this.callServer.get<WishlistDto>('/api/Wishlist');
  }

  addToWishlist(item: WishlistItemDto): Observable<WishlistDto> {
    return this.callServer.post<WishlistDto>('/api/Wishlist/add', item);
  }

  removeFromWishlist(productId: number): Observable<void> {
    return this.callServer.delete<void>(`/api/Wishlist/remove/${productId}`);
  }
}
