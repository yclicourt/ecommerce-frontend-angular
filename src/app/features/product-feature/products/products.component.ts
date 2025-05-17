import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '@shared/services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../../models/Product';
import { RouterLink } from '@angular/router';
import { ProductFormComponent } from '@components/product-form/product-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../../../shared/common/components/header/header.component';

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
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  selectedProduct: Product;
  private toastr = inject(ToastrService);
  private userService = inject(UserService);
  productService = inject(ProductService);

  constructor() {
    this.selectedProduct = {
      id: 1,
      name: 'test',
      price: 100,
      description: 'test description',
      image: 'image.com',
    };
  }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productService.products = data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

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
        console.log(data);
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
        }
      },
    });
  }
}
