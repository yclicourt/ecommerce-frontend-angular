import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '@shared/services/order.service';
import { ProductService } from '@shared/services/product.service';
import { UserService } from '@shared/services/user.service';
import { StatCardComponent } from '../../shared/common/components/dashboard-admin-components/stat-card/stat-card.component';
import { Product } from '@features/product-feature/interfaces/Product';
import { Order } from '@features/orders/interfaces/order.interface';
import { User } from '@features/auth/interfaces/register.interface';
import { DashboardStats } from './interfaces/dashboard-stats.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-graph',
  standalone: true,
  imports: [StatCardComponent, CommonModule],
  templateUrl: './dashboard-graph.component.html',
  styleUrl: './dashboard-graph.component.css',
})
export default class DashboardGraphComponent implements OnInit {

  // Inject Services
  productService = inject(ProductService);
  userService = inject(UserService);
  orderService = inject(OrderService);

  stats: DashboardStats = {
    todaysMoney: 0,
    todaysUsers: 0,
    newClients: 0,
    sales: 0,
    activeUsersPercentage: '0%',
    monthlySales: 0,
    salesTrend: '+0%',
  };

  // Cache for new clients calculation
  private newClientsCache: {
    month: number;
    year: number;
    count: number;
  } | null = null;

  ngOnInit(): void {
    this.initializeData();
  }

  // Method to initialize data
  private initializeData(): void {
    const products = this.productService.products;
    const users = this.userService.users;
    const orders = this.orderService.orders;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    this.stats = {
      todaysMoney: this.calculateTodaySales(products, today),
      todaysUsers: this.getNewUsersToday(users, today),
      newClients: this.getNewClientsThisMonth(users, currentMonth, currentYear),
      sales: this.calculateTotalSales(orders, products),
      activeUsersPercentage: this.getActiveUsersPercentage(users),
      ...this.calculateSalesData(products),
    };
  }

  // Method to calculate sales data
  private calculateSalesData(products: Product[]): {
    monthlySales: number;
    salesTrend: string;
  } {
    const monthlySales = products.reduce(
      (total, product) => total + (product.price || 0),
      0
    );

    const previousMonthSales = 10000;
    const difference = monthlySales - previousMonthSales;
    const percentage = (difference / previousMonthSales) * 100;

    return {
      monthlySales,
      salesTrend: `${percentage >= 0 ? '+' : ''}${percentage.toFixed(0)}%`,
    };
  }

  // Method to calculate sales today
  private calculateTodaySales(products: Product[], today: string): number {
    return products
      .filter(
        (p) =>
          p.createdAt &&
          new Date(p.createdAt).toISOString().split('T')[0] === today
      )
      .reduce((sum, product) => sum + (product.price || 0), 0);
  }

  // Method to get new users today
  private getNewUsersToday(users: User[], today: string): number {
    return users.filter(
      (u) =>
        u.createdAt &&
        new Date(u.createdAt).toISOString().split('T')[0] === today
    ).length;
  }

  // Method to get user active percentage 
  private getActiveUsersPercentage(users: User[]): string {
    const total = users.length;
    if (total === 0) return '0%';

    const active = users.filter((u) => u.status === 'ACTIVE').length;
    return `${((active / total) * 100).toFixed(1)}%`;
  }

  // Method to get new clients by month
  private getNewClientsThisMonth(
    users: User[],
    currentMonth: number,
    currentYear: number
  ): number {
    if (
      this.newClientsCache?.month === currentMonth &&
      this.newClientsCache?.year === currentYear
    ) {
      return this.newClientsCache.count;
    }

    const count = users.filter((user) => {
      const userDate = new Date(user.createdAt);
      return (
        userDate.getMonth() === currentMonth &&
        userDate.getFullYear() === currentYear
      );
    }).length;

    this.newClientsCache = { month: currentMonth, year: currentYear, count };
    return count;
  }

  // Method to calculate total sales
  private calculateTotalSales(orders: Order[], products: Product[]): number {
    return orders.reduce((total, order) => {
      const items = order.purchase_units[0]?.items || [];
      return (
        total +
        items.reduce((orderTotal, item) => {
          const product = products.find((p) => p.id === item.id);
          return orderTotal + (product?.price || 0) * Number(item.quantity);
        }, 0)
      );
    }, 0);
  }
}
