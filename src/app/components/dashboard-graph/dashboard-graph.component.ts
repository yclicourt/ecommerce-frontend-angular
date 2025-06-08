import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '@shared/services/order.service';
import { ProductService } from '@shared/services/product.service';
import { UserService } from '@shared/services/user.service';
import { StatCardComponent } from '../../shared/common/components/dashboard-admin-components/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard-graph',
  standalone: true,
  imports: [StatCardComponent],
  templateUrl: './dashboard-graph.component.html',
  styleUrl: './dashboard-graph.component.css',
})
export default class DashboardGraphComponent implements OnInit {
  productService = inject(ProductService);
  userService = inject(UserService);
  orderService = inject(OrderService);

  monthlySales: number = 0;
  salesTrend: string = '+0%';

  stats = {
    todaysMoney: this.calculateTodaySales(),
    todaysUsers: this.getNewUsersToday(),
    newClients: this.getNewClientsThisMonth(),
    sales: this.calculateTotalSales(),
  };

  ngOnInit(): void {
    this.calculateSalesData();
  }

  // Method to calculate sales data
  calculateSalesData(): void {
    this.monthlySales = this.productService.products.reduce(
      (total, product) => total + (product.price || 0),
      0
    );

    // Trend calculation
    const previousMonthSales = 10000;
    const difference = this.monthlySales - previousMonthSales;
    const percentage = (difference / previousMonthSales) * 100;

    this.salesTrend = `${percentage >= 0 ? '+' : ''}${percentage.toFixed(0)}%`;
  }

  // Method to calculate sales today
  calculateTodaySales(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.productService.products
      .filter(
        (p) =>
          p.createdAt &&
          new Date(p.createdAt).toISOString().split('T')[0] === today
      )
      .reduce((sum, product) => sum + (product.price || 0), 0);
  }

  // Method to get new users
  getNewUsersToday(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.userService.users.filter(
      (u) =>
        u.createdAt &&
        new Date(u.createdAt).toISOString().split('T')[0] === today
    ).length;
  }

  // Method to get percentage users active
  getActiveUsersPercentage(): string {
    const total = this.userService.users.length;
    const active = this.userService.users.filter(
      (u) => u.status === 'ACTIVE'
    ).length;
    return `${((active / total) * 100).toFixed(1)}%`;
  }

  private lastCalculation: {
    month: number;
    year: number;
    count: number;
  } | null = null;

  // Method to get new clients in a especific month
  getNewClientsThisMonth(): number {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Return cached value if it is the same month
    if (
      this.lastCalculation?.month === currentMonth &&
      this.lastCalculation?.year === currentYear
    ) {
      return this.lastCalculation.count;
    }

    const count = this.userService.users.filter((user) => {
      const userDate = new Date(user.createdAt);
      return (
        userDate.getMonth() === currentMonth &&
        userDate.getFullYear() === currentYear
      );
    }).length;

    // Update cache
    this.lastCalculation = { month: currentMonth, year: currentYear, count };
    return count;
  }

  // Method to calculte total sales
  calculateTotalSales(): number {
    return this.orderService.orders.reduce((total, order) => {
      return (
        total +
        order.purchase_units[0].items!!.reduce((orderTotal, item) => {
          const product = this.productService.products.find(
            (p) => p.id === item.id
          );
          return orderTotal + (product?.price || 0) * Number(item.quantity);
        }, 0)
      );
    }, 0);
  }
}
