import { Component, inject, OnInit } from '@angular/core';
import { Role } from '@features/auth/interfaces/register.interface';
import { UserService } from '@shared/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { HasRoleDirective } from 'src/app/core/has-role.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { CartItem } from '@features/cart/interfaces/cart-item.interface';
import { CartService } from '@shared/services/cart.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, HasRoleDirective, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  userService = inject(UserService);
  cartService = inject(CartService);
  toastr = inject(ToastrService);
  router = inject(Router);
  Role = Role;
  currentUser = toSignal(this.userService.currentUser$);

  cartItemCount = 0;
  cartItems: CartItem[] = [];
  showCart = false;
  cartItemAdded = false;

  ngOnInit(): void {
    // Load Cart to init
    this.cartService.loadCart().subscribe();

    // Suscribe to changes
    this.cartService.currentCartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartItemCount = this.cartService.getTotalItems();
    });
  }

  // Check if show cart
  toggleCart() {
    this.showCart = !this.showCart;
  }

  // Method to remove Item Cart
  removeItem(cartItemId: number) {
    if (!cartItemId) {
      console.error('Cannot remove item: no ID provided');
      return;
    }
    this.cartService.removeFromCart(cartItemId).subscribe({
      next: () => {
        this.loadCartItems();
        this.toastr.success('Item remove from cart successfully');
      },
      error: (e) => {
        this.toastr.error('Error to remove item from cart', e);
      },
    });
  }

  // Method to load Cart Items
  loadCartItems() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  logout(): void {
    this.userService.logout();
  }

  getProfile(id?: number) {
    if (!id) return;
    this.userService.getUser(id).subscribe({
      next: (data) => {
        this.router.navigate(['/profile', data.id]);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }
  hasRole(roles: Role[]) {
    return this.currentUser()?.role?.some((role) => roles.includes(role));
  }
}
