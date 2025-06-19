import { CommonModule, NgFor } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { CategoryName } from '@components/product-form/enums/category-name.enum';
import { HeaderComponent } from '@shared/common/components/header/header.component';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { UserService } from '@shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '@features/product-feature/interfaces/Product';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';
import { FooterComponent } from '@shared/common/components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export default class HomeComponent implements OnInit {
  // Inject Services
  productService = inject(ProductService);
  userService = inject(UserService);
  cartService = inject(CartService);
  router = inject(Router);
  private toastr = inject(ToastrService);

  CategoryName = CategoryName;
  productsByCategory: { [key in CategoryName]?: Product[] } = {};
  private API_URL = environment.apiUrl;

  showScrollButton = false;
  private scrollThreshold = 300;

  ngOnInit(): void {
    this.initializeCategories();
    this.getProductsbyCategories();
  }

  // Inicialize those categories based in enum
  private initializeCategories() {
    Object.values(CategoryName).forEach((category) => {
      this.productsByCategory[category] = [];
    });
  }

  //Method to get all products
  getProductsbyCategories() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productService.products = data;
        this.groupProductsByCategory();
      },
      error: (e) => {
        console.log(e);
        this.router.navigateByUrl('/error');
      },
    });
  }

  // Method to group product by category
  private groupProductsByCategory() {
    // We restart the categories
    this.initializeCategories();

    this.productService.products.forEach((product) => {
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach((category) => {
          const categoryName = category.name?.toUpperCase() as CategoryName;

          // Verify if exists category in enum
          if (
            categoryName &&
            Object.values(CategoryName).includes(categoryName)
          ) {
            if (!this.productsByCategory[categoryName]) {
              this.productsByCategory[categoryName] = [];
            }
            this.productsByCategory[categoryName]?.push(product);
          }
        });
      }
    });
  }

  // Get URL image
  getSafeImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '/no-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.API_URL}/${imagePath.replace(/^\//, '')}`;
  }

  // Method to add item to cart
  addItemCart(product: Product) {
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
