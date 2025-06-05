import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '@shared/common/components/header/header.component';
import { ProductService } from '@shared/services/product.service';
import { UserService } from '@shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
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

  private toastr = inject(ToastrService);

  private API_URL = environment.apiUrl;

  ngOnInit(): void {
    this.getProductsbyCategories();
  }

  //Method to get all products
  getProductsbyCategories() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productService.products = data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  // Get URL image
  getSafeImageUrl(imagePath: string | undefined): string {
    if (!imagePath) return '/no-image.png';
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.API_URL}/${imagePath.replace(/^\//, '')}`;
  }
}
