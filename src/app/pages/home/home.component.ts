import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { CategoryName } from '@components/product-form/enums/category-name.enum';
import { HeaderComponent } from '@shared/common/components/header/header.component';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { UserService } from '@shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '@features/product-feature/interfaces/Product';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  userService = inject(UserService);
  cartService = inject(CartService);

  private toastr = inject(ToastrService);
  CategoryName = CategoryName;
  productsByCategory: { [key in CategoryName]?: Product[] } = {};
  private API_URL = environment.apiUrl;

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
      },
    });
  }
}
