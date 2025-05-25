import { CommonModule, NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '@shared/services/product.service';
import { UserService } from '@shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/Product';

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
  @Output() saveChanges = new EventEmitter<Product>();

  // Inject Services
  productService = inject(ProductService);
  userService = inject(UserService);
  private toastr = inject(ToastrService);

  // Method to close modal
  closeEditModal() {
    this.editingProduct = null;
    this.showEditing = false;
  }

  // Method to get all products on dashboard
  getProductDashboard() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.productService.products = data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  //Method to emit event 
  saveProductChanges() {
    if (this.editingProduct) {
      this.saveChanges.emit(this.editingProduct);
    }
  }
}
