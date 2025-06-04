import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CartItem } from '@features/cart/interfaces/cart-item.interface';
import { INTENT } from '@features/orders/enums/intent.enum';
import { CaptureOrderResponse } from '@features/orders/interfaces/capture-order.interface';
import { Order } from '@features/orders/interfaces/order.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http = inject(HttpClient);
  private API_URL = `${environment.apiUrl}/orders`;
  private FRONTEND_URL = environment.clientUrl;
  private BRAND_NAME = environment.brandName;

  constructor() {}

  // Method to create order
  createOrder(
    cartItems: CartItem[],
    token: string | null
  ): Observable<{ order: Order; approval_url: string }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const order = {
      intent: INTENT.CAPTURE,
      purchase_units: cartItems.map((item, index) => ({
        reference_id: `ref_${index}_${Date.now()}`,
        amount: {
          currency_code: 'USD',
          value: (item.price * item.quantity).toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'USD',
              value: (item.price * item.quantity).toFixed(2),
            },
          },
        },
        items: [
          {
            name: item.name,
            unit_amount: {
              currency_code: 'USD',
              value: item.price.toFixed(2),
            },
            quantity: item.quantity,
          },
        ],
      })),
      application_context: {
        return_url: `${this.FRONTEND_URL}/order/success`,
        cancel_url: `${this.FRONTEND_URL}/order/cancel`,
        brand_name: this.BRAND_NAME,
        user_action: 'PAY_NOW',
      },
    };

    return this.http.post<{ order: Order; approval_url: string }>(
      `${this.API_URL}/create-order`,
      order,
      { headers }
    );
  }
  // Method to capture order
  captureOrder(token: string | null): Observable<CaptureOrderResponse> {
    return this.http.get<CaptureOrderResponse>(`${this.API_URL}/capture-order?token=${token}`);
  }

  // Method to cancel order
  cancelOrder() {
    return this.http.get<Order>(`${this.API_URL}/cancel-order`);
  }
}
