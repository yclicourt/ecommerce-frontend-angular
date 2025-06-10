import { Component, HostListener, inject, OnInit } from '@angular/core';
import { ProductService } from '@shared/services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../interfaces/Product';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductFormComponent } from '@components/product-form/product-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../../../shared/common/components/header/header.component';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment.development';
import { CartComponent } from '../../cart/cart.component';
import { CartService } from '@shared/services/cart.service';
import { CartItem } from '@features/cart/interfaces/cart-item.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    RouterLink,
    ProductFormComponent,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    HeaderComponent,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  selectedProduct!: Product;

  private toastr = inject(ToastrService);
  private userService = inject(UserService);
  productService = inject(ProductService);
  cartService = inject(CartService);
  router = inject(Router);

  private API_URL = environment.apiUrl;
  showScrollButton = false;
  private scrollThreshold = 300;

  constructor() {
    this.selectedProduct = {} as Product;
  }

  ngOnInit(): void {
    this.getProducts();
  }

  // Method to get all products
  getProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productService.products = data;
      },
      error: (e) => {
        console.log(e);
        this.router.navigateByUrl('/error');
      },
    });
  }

  // Get URL image
  getSafeImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '/no-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.API_URL}/${imagePath.replace(/^\//, '')}`;
  }
  // Method to delete a product
  deleteProduct(id: number) {
    // Verify if user is autenticated
    if (!this.userService.isAuthenticated()) {
      this.toastr.error('You need a session to create products');
      return;
    }

    // Verify rol user
    if (!this.userService.getCurrentUserRole()) {
      this.toastr.error('Need privileges to complete this action');
      return;
    }

    // Getting token
    const token = this.userService.getToken();

    this.productService.deleteProduct(id, token).subscribe({
      next: (data) => {
        this.toastr.success('Product deleted successfully');
        this.getProducts();
      },
      error: (e: HttpErrorResponse) => {
        if (e.status == 401) {
          this.toastr.error('Session Expired, please init session again');
          this.userService.logout();
        } else if (e.status == 403) {
          this.toastr.error('Forbbiden');
        } else {
          console.log(e);
          this.toastr.error('Error to delete product');
          this.router.navigateByUrl('/error');
        }
      },
    });
  }

  // Method to Add Item to Cart
  addItemToCart(product: Product) {
    this.cartService.addCartItem(product).subscribe({
      next: (data) => {
        this.toastr.success('Item added to cart successfully ');
      },
      error: (e) => {
        console.error('Error to added a cart', e);
        this.router.navigateByUrl('/error');
      },
    });
  }

  // Method to load product for edit
  loadProductForEdit(product: Product) {
    this.selectedProduct = product;
  }

  // Handle error
  handleImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/no-image.png';
    img.onerror = null;
  }

  // Method to check scroll position
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }
  // Check if the scroll is greater than threshold
  checkScroll() {
    this.showScrollButton = window.pageYOffset > this.scrollThreshold;
  }

  // Scroll to top of the page
  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
