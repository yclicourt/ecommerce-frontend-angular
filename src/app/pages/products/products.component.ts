import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/common/components/header/header.component';
import { ProductService } from '../../shared/services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Product } from '../../models/Product';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeaderComponent, MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  selectedProduct: Product;

  constructor(public productService: ProductService) {
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
}
