import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartDto } from '../interfaces/CartDto';
import { CartItemDto } from '../interfaces/CartItemDto';
import { CallServerService } from './call-server.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private callServer: CallServerService) {}

  getCart(): Observable<CartDto> {
    return this.callServer.get<CartDto>('/api/Cart');
  }

  addToCart(cartItem: CartItemDto): Observable<CartDto> {
    return this.callServer.post<CartDto>('/api/Cart/add', cartItem);
  }

  updateProductQuantity(
    productId: number,
    quantity: number
  ): Observable<CartDto> {
    return this.callServer.put<CartDto>(
      `/api/Cart/update-quantity/${productId}`,
      null,
      { quantity }
    );
  }

  removeFromCart(productId: number): Observable<void> {
    return this.callServer.delete<void>(`/api/Cart/remove/${productId}`);
  }
}
