import { Component, inject, OnInit } from '@angular/core';
import { Order } from './interfaces/order.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@shared/services/order.service';
import { CartService } from '@shared/services/cart.service';
import { CommonModule, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export default class OrdersComponent implements OnInit {
  order!: Order;
  loading = true;
  error: string | null = null;

  route = inject(ActivatedRoute);
  router!: Router;
  orderService = inject(OrderService);
  cartService = inject(CartService);
  toastr = inject(ToastrService);
  orderTotal!: string | number;
  currentDate!: string | number | Date;

  ngOnInit(): void {
    this.captureOrder();
  }

  captureOrder() {
    const token = this.route.snapshot.queryParamMap.get('token');
    this.orderService.captureOrder(token!).subscribe({
      next: (order) => {
        this.order = order;
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

  continueShopping() {
    this.router.navigateByUrl('/products');
  }
}
