import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environments';

export interface CartItem {
  cart_id?: number;
  user_id: number;
  product_id: number;
  quantity: number;
  added_at?: string;

  product_name?: string;
  price?: number;
  image_url?: string;
  username?: string;
}

// ============== MOCK DATA ==============
const MOCK_CART_DATA: CartItem[] = [
  { cart_id: 1, user_id: 1, product_id: 1, quantity: 2, added_at: '2025-11-21' },
  { cart_id: 2, user_id: 1, product_id: 2, quantity: 1, added_at: '2025-11-21' },
];

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/Carts`;
  private useMockup = true; // Toggle để sử dụng mockup
  
  cartChanged = new Subject<void>();

  constructor(private http: HttpClient) {}

  getCartsByUserId(userId: number): Observable<CartItem[]> {
    if (this.useMockup) {
      const mockCarts = MOCK_CART_DATA.filter(item => item.user_id === userId);
      return of(mockCarts);
    }
    return this.http.get<CartItem[]>(`${this.apiUrl}/user/${userId}`);
  }

  getAllCarts(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  getCartById(cartId: number): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.apiUrl}/${cartId}`);
  }

  addToCart(item: CartItem): Observable<any> {
    if (this.useMockup) {
      // Thêm vào mockup cart
      const newItem: CartItem = {
        cart_id: (MOCK_CART_DATA.length > 0 ? Math.max(...MOCK_CART_DATA.map(c => c.cart_id || 0)) : 0) + 1,
        user_id: item.user_id,
        product_id: item.product_id,
        quantity: item.quantity,
        added_at: new Date().toISOString(),
      };
      MOCK_CART_DATA.push(newItem);
      this.cartChanged.next();
      return of({ success: true });
    }
    return this.http.post(this.apiUrl, item).pipe(tap(() => {
      this.cartChanged.next();
    }));
  }

  updateCart(cartId: number, item: CartItem): Observable<any> {
    if (this.useMockup) {
      const mockItem = MOCK_CART_DATA.find(c => c.cart_id === cartId);
      if (mockItem) {
        mockItem.quantity = item.quantity;
      }
      this.cartChanged.next();
      return of({ success: true });
    }
    return this.http.put(`${this.apiUrl}/${cartId}`, item).pipe(tap(() => {
      this.cartChanged.next();
    }));
  }

  deleteCart(cartId: number): Observable<any> {
    if (this.useMockup) {
      const index = MOCK_CART_DATA.findIndex(c => c.cart_id === cartId);
      if (index > -1) {
        MOCK_CART_DATA.splice(index, 1);
      }
      this.cartChanged.next();
      return of({ success: true });
    }
    return this.http.delete(`${this.apiUrl}/${cartId}`).pipe(tap(() => {
      this.cartChanged.next();
    }));
  }
}
