import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/common/components/header/header.component';
import { ProductService } from '../../shared/services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../models/Product';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductFormComponent } from '../../shared/components/product-form/product-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    HeaderComponent,
    MatCardModule,
    MatButtonModule,
    RouterLink,
    ProductFormComponent,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  selectedProduct: Product;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public productService: ProductService
  ) {
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
    this.productService.deleteProduct(id).subscribe({
      next: (data) => {
        console.log(data);
        this.toastr.success('Product deleted successfully');
        this.getProducts();
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
