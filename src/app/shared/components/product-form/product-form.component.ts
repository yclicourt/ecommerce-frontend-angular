import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { Role, Usuario } from '../../../auth/interfaces/register.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  name: FormControl;
  description: FormControl;
  price: FormControl;
  image: FormControl;

  
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
    this.createProduct();
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
    this.productService.createProduct(this.productForm.value,token).subscribe({
      next: (data) => {
        this.toastr.success('Product added successfully');
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
          this.toastr.error('Error to create product');
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
}
