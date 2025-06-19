import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CartItem } from '@features/orders/interfaces/cart-item.interface';
import { Cart } from '@features/orders/interfaces/cart.interface';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ProductService } from './product.service';
import { Product } from '@features/product-feature/interfaces/Product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private API_URL = `${environment.apiUrl}/cart`;

  // Inject Services
  productService = inject(ProductService);
  http = inject(HttpClient);
  constructor() {}

  // Local state of cart
  private _cartItems = new BehaviorSubject<CartItem[]>([]);
  currentCartItems$ = this._cartItems.asObservable();

  // Initial load cart to backend
  loadCart(): Observable<CartItem[]> {
    return this.http
      .get<CartItem[]>(`${this.API_URL}/cart/items`)
      .pipe(tap((items) => this._cartItems.next(items)));
  }

  // Add Item to Cart
  addCartItem(product: Product): Observable<CartItem> {
    const newItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    };
    return this.http.post<CartItem>(`${this.API_URL}/item`, newItem).pipe(
      tap((createdItem) => {
        const currentItems = this._cartItems.value;
        this._cartItems.next([...currentItems, createdItem]);
      })
    );
  }

  // Method to get All Cart Items
  getCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.API_URL}/item`);
  }

  // Method to remove Cart
  removeFromCart(cartItemId: number): Observable<CartItem> {
    return this.http
      .delete<CartItem>(`${this.API_URL}/item/${cartItemId}`)
      .pipe(
        tap(() => {
          // Update local state after success in backend
          const updatedItems = this._cartItems.value.filter(
            (item) => item.id !== cartItemId
          );
          this._cartItems.next(updatedItems);
        })
      );
  }


  // Method to clear cart
  clearCart(): Observable<any> {
    return this.http
      .delete(this.API_URL)
      .pipe(tap(() => this._cartItems.next([])));
  }

  // Method to calculate total Items
  getTotalItems(): number {
    return this._cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
  }
  // Method to calculate total Price
  getTotalPrice(): number {
    return this._cartItems.value.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }
}
