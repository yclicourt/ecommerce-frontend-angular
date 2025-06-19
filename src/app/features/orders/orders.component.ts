import { Component, inject, OnInit } from '@angular/core';
import { Order } from './interfaces/order.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '@shared/services/order.service';
import { CartService } from '@shared/services/cart.service';
import { CommonModule, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CaptureOrderResponse } from './interfaces/capture-order.interface';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export default class OrdersComponent implements OnInit {
  order!: CaptureOrderResponse;
  loading = true;
  error: string | null = null;

  // Inject Services
  route = inject(ActivatedRoute);
  router = inject(Router);
  orderService = inject(OrderService);
  cartService = inject(CartService);
  toastr = inject(ToastrService);


  orderTotal!: string | number;
  currentDate!: string | number | Date;

  ngOnInit(): void {
    this.captureOrder();
  }

  // Method to capture Order
  captureOrder() {
    const token = this.route.snapshot.queryParamMap.get('token');
    this.orderService.captureOrder(token!).subscribe({
      next: (order: CaptureOrderResponse) => {
        this.order = order;
        this.orderTotal = this.calculateOrderTotal(order);
        this.currentDate = new Date();
        this.toastr.success('Order completed succesffully');
        this.loading = false;
        this.cartService.clearCart();
      },
      error: (err) => {
        console.error('Error capturing payment:', err);
        this.error = 'Error processing your order';
        this.loading = false;
      },
    });
  }

  // Method to calculate total payments in Order
  private calculateOrderTotal(order: CaptureOrderResponse): string {
    if (!order.purchase_units?.length) return '0.00';
    return order.purchase_units[0].payments.captures[0].amount.value;
  }
  continueShopping() {
    this.router.navigateByUrl('/products');
  }
}
