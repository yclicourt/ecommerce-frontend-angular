import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '@shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from 'src/app/models/Product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  name: FormControl;
  description: FormControl;
  price: FormControl;
  image: FormControl;
  isEditMode: boolean = false;
  currentProductId: number | null = null;

  @Input() productToEdit: Product | null = null;

  public productService = inject(ProductService);
  private toastr = inject(ToastrService);
  private userService = inject(UserService);

  constructor() {
    this.name = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.price = new FormControl('', Validators.required);
    this.image = new FormControl('', Validators.required);
    this.productForm = new FormGroup({
      name: this.name,
      description: this.description,
      price: this.price,
      image: this.image,
    });
  }

  ngOnInit(): void {
    this.getProducts();
  }

  createProduct() {
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

    this.productService.createProduct(this.productForm.value, token).subscribe({
      next: (data) => {
        this.toastr.success('Product added successfully');
        this.getProducts();
      },
      error: (e: HttpErrorResponse) => {
        if (e.status == 400) {
          this.toastr.error(e.error.message)
        } else if (e.status == 401) {
          this.toastr.error('Session Expired, please init session again');
          this.userService.logout();
        } else if (e.status == 403) {
          this.toastr.error('Forbbiden');
        } else {
          console.log(e);
        }
      },
    });
    this.productForm.reset();
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productToEdit'] && this.productToEdit) {
      this.loadProductForEdit(this.productToEdit);
    }
  }

  loadProductForEdit(product: Product) {
    this.isEditMode = true;
    this.currentProductId = product.id;

    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.currentProductId = null;
    this.productForm.reset();
  }

  updateProduct() {
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

    this.productService
      .updateProduct(this.productForm.value, this.currentProductId, token)
      .subscribe({
        next: () => {
          this.toastr.success('Product updated successfully');
          this.resetForm();
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
          }
        },
      });
  }
}
