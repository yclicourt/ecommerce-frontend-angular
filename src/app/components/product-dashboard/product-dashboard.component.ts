import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '@shared/services/product.service';
import { UserService } from '@shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from '@features/product-feature/interfaces/Product';
import { ProductModalUpdatedComponent } from '../../shared/common/components/dashboard-admin-components/product-modal-updated/product-modal-updated.component';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-dashboard',
  standalone: true,
  imports: [CommonModule, ProductModalUpdatedComponent],
  templateUrl: './product-dashboard.component.html',
  styleUrl: './product-dashboard.component.css',
})
export default class ProductDashboardComponent implements OnInit {
  selectProduct!: Product | undefined;
  editingProduct: Product | null = null;
  currentProductId!: number | null;
  showEditing = false;

  // Services Injection
  productService = inject(ProductService);
  userService = inject(UserService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private API_URL = environment.apiUrl;

  ngOnInit(): void {
    this.getProductDashboard();
  }

  // Method to get all products dashboard
  getProductDashboard() {
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

  // Method to get path of image
  getProductImage(imagePath: string): string {
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }

    return `${this.API_URL}${imagePath}`;
  }

  // Method to open modal
  openModalUpdated(product: Product) {
    //Create a product COPY to edit
    this.editingProduct = { ...product };
    this.showEditing = true;
  }

  // Method to close modal
  closeEditModal() {
    this.editingProduct = null;
    this.showEditing = false;
  }

  // Method to updated product at dashboard
  updatedProductDashboard(event: { product: Product; imageFile?: File }) {
    const { product, imageFile } = event;
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

    if (!this.editingProduct || !this.editingProduct.id) {
      this.toastr.error('No product selected for update');
      return;
    }

    // Verify id product if exists
    const id = this.editingProduct.id;
    if (!id) {
      this.toastr.error('Product ID is missing');
      return;
    }

    // Form Data
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description!);
    formData.append('price', product.price.toString());

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (product.image) {
      formData.append('imageUrl', product.image);
    }

    // Call the service to update the product
    this.productService.updateProduct(formData, id, token).subscribe({
      next: () => {
        this.toastr.success('Product updated successfully');
        this.closeEditModal();
        this.getProductDashboard();
      },
      error: (error: HttpErrorResponse) => {
        // Handle different error statuses
        if (error.status === 401) {
          this.toastr.error('Session expired, please login again');
          this.userService.logout();
        } else if (error.status === 403) {
          this.toastr.error('Forbidden: Insufficient permissions');
        } else if (error.status === 400) {
          this.toastr.error('Invalid product data');
        } else {
          this.toastr.error('Error updating product');
          console.error('Update error:', error);
          this.router.navigateByUrl('/error');
        }
      },
    });
  }

  // Method to delete product at dashboard
  deleteProductDashboard(productId: number) {
    // Assign the ID to the currentProductId property
    this.currentProductId = productId;

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

    //Verify product not null
    if (this.currentProductId === null) {
      this.toastr.error('No product selected for update');
      return;
    }
    // Call the service to delete the product
    this.productService.deleteProduct(this.currentProductId, token).subscribe({
      next: () => {
        this.toastr.success('Product deleted successfully');
        this.getProductDashboard();
      },
      error: (e: HttpErrorResponse) => {
        // Handle different error statuses
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
}
