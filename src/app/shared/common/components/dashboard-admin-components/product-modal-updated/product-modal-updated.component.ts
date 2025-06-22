import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '@shared/services/product.service';
import { UserService } from '@shared/services/user.service';
import { Product } from '@features/product-feature/interfaces/Product';
import { environment } from '@envs/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-modal-updated',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './product-modal-updated.component.html',
  styleUrl: './product-modal-updated.component.css',
})
export class ProductModalUpdatedComponent {
  //Comunication with ProductDashboardComponent(parent)
  @Input() editingProduct: Product | null = null;
  @Input() showEditing: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveChanges = new EventEmitter<{
    product: Product;
    imageFile?: File;
  }>();

  private API_URL = environment.apiUrl;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  // Inject Services
  productService = inject(ProductService);
  userService = inject(UserService);
  router = inject(Router)

  // Method to close modal
  closeEditModal() {
    this.editingProduct = null;
    this.showEditing = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.closeModal.emit();
  }

  // Method to get all products on dashboard
  getProductDashboard() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productService.products = data;
      },
      error: (e) => {
        console.log(e);
        this.router.navigateByUrl('/error')
      },
    });
  }

  // Method to select a file
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      // Show a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Method to get image path
  getImageUrl(imagePath: string): string {
    if (imagePath.startsWith('http') || imagePath.startsWith('https')) {
      return imagePath;
    }
    return `${this.API_URL}${imagePath}`;
  }

  //Method to emit event
  saveProductChanges() {
    if (this.editingProduct) {
      this.saveChanges.emit({
        product: this.editingProduct,
        imageFile: this.selectedFile || undefined,
      });
    }
  }
}
