import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order } from '@features/orders/interfaces/order.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http = inject(HttpClient);
  private API_URL = `${environment.apiUrl}/orders`;

  constructor() {}

  // Method to create order
  createOrder(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http.post<Order>(`${this.API_URL}/create-order`, { headers });
  }
   // Method to capture order
  captureOrder(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.http.get<Order>(`${this.API_URL}/capture-order`, { headers });
  }

   // Method to cancel order
  cancelOrder() {
    this.http.get<Order>(`${this.API_URL}/cancel-order`);
  }
}
