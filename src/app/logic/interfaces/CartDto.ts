import { CartItemDto } from './CartItemDto';

export interface CartDto {
  userId: string;
  items: CartItemDto[];
  totalPrice: number;
}
