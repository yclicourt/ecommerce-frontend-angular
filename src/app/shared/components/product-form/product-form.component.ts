import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    public productService: ProductService,
    private toastr: ToastrService
  ) {
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
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (data) => {
        this.toastr.success('Product added successfully');
        this.getProducts();
      },
      error: (e) => {
        console.log(e);
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
