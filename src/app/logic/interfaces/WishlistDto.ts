import { WishlistItemDto } from './WishlistItemDto';

export interface WishlistDto {
  userId: string;
  items: WishlistItemDto[];
  totalItems: number;
}
