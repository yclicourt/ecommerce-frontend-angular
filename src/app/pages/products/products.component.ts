import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/common/components/header/header.component';
import { ProductService } from '../../shared/services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeaderComponent, MatCardModule, MatButtonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  constructor(public productService: ProductService) {}

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
