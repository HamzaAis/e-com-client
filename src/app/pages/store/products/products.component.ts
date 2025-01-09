import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardComponent } from '../../../components/card/card.component';
import { CartService } from '../../../services/cart.service';
import { ProductService } from '../../../services/product.service';
import { WishListService } from '../../../services/wish-list.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, CardComponent],
  template: `
    <div class="container mx-auto px-4 py-6">
      <h1 class="text-2xl font-bold mb-6">Products</h1>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <app-card
          *ngFor="let product of products"
          [title]="product.title"
          [image]="product.img"
          [price]="product.price"
          [stock]="product.stock"
          (addToCart)="handleAddToCart(product)"
          (addToWishlist)="handleAddToWishlist(product)"
        ></app-card>
      </div>
    </div>
  `,
  styles: [],
})
export class ProductsComponent implements OnInit {
  products: any[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishListService: WishListService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts({}).subscribe({
      next: (res) => {
        this.products = res.data;
      },
      error: (err) => console.error('Failed to load products', err),
    });
  }

  handleAddToCart(product: any) {
    this.cartService
      .addToCart({
        productId: product.id,
        quantity: 1, // Default to 1 for now
        price: product.price,
        title: product.title, // New Field
        image: product.img, // New Field
      })
      .subscribe({
        next: () => console.log(`Added ${product.title} to the cart!`),
        error: (err) => console.error('Failed to add to cart', err),
      });
  }

  handleAddToWishlist(product: any) {
    this.wishListService
      .addToWishlist({
        productId: product.id,
        title: product.title, // New Field
        image: product.img, // New Field
      })
      .subscribe({
        next: () => console.log(`Added ${product.title} to the wishlist!`),
        error: (err) => console.error('Failed to add to wishlist', err),
      });
  }
}
