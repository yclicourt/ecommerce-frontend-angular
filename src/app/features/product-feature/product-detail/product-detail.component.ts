import { Component, OnInit } from '@angular/core';
import { ProductService } from '@shared/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../models/Product';
import { HeaderComponent } from '@shared/common/components/header/header.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [HeaderComponent,MatCardModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit {
  selectedProduct: Product;

  constructor(
    private route: ActivatedRoute,
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
    const id = this.route.snapshot.params['id'];
    this.getProduct(id);
  }

  // Method to get a product by ID
  getProduct(id: number) {
    return this.productService.getProduct(id).subscribe({
      next: (data) => {
        this.selectedProduct = data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }
}
