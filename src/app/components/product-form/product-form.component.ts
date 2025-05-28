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
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';

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
  currentProductId: number | undefined;
  imageFile: File | null = null;
  currentImageUrl: string | null = null;

  @Input() productToEdit: Product | null = null;

  public productService = inject(ProductService);
  private API_URL = environment.apiUrl;
  private toastr = inject(ToastrService);
  private userService = inject(UserService);

  constructor() {
    this.name = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.price = new FormControl('', Validators.required);
    this.image = new FormControl(null as File | null);
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

  async createProduct() {
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

    if (this.productForm.valid) {
      const formData = new FormData();

      // Add all form fields to the FormData object
      Object.keys(this.productForm.controls).forEach((key) => {
        if (key !== 'image') {
          formData.append(key, this.productForm.get(key)?.value);
        }
      });

      // Add the image file
      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      try {
        await firstValueFrom(
          this.productService.createProduct(formData, token)
        );
        this.toastr.success('Product added successfully');
        this.getProducts();
        this.productForm.reset();
      } catch (error: any) {
        console.error('Create Product error:', error);
        this.toastr.error(error.error?.message || 'Registration failed');
      }
    } else {
      this.toastr.warning('Please fill all required fields correctly');
      this.productForm.markAllAsTouched();
    }
  }

  getFullImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return '/assets/no-image.png';
    if (imagePath.startsWith('blob:')) return imagePath; // Para previews
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.API_URL}/${imagePath.replace(/^\//, '')}`;
  }

  loadProductImage() {
    if (this.productForm.get('image')?.value) {
      this.currentImageUrl = this.getFullImageUrl(
        this.productForm.get('image')?.value
      );
    }
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

  onFileChanges(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      // Show preview of the new image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      // Update a form
      this.productForm.patchValue({
        image: file.name,
      });
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

    this.currentImageUrl = this.getFullImageUrl(product.image!);
    this.imageFile = null;
  }

  resetForm() {
    this.isEditMode = false;
    this.currentProductId = undefined;
    this.productForm.reset();
  }

  async updateProduct() {
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

    if (this.productForm.valid) {
      const formData = new FormData();

      // Add all form fields to the FormData object
      Object.keys(this.productForm.controls).forEach((key) => {
        if (key !== 'image') {
          formData.append(key, this.productForm.get(key)?.value);
        }
      });

      // Add the image file if a new one was selected
      if (this.imageFile) {
        formData.append('image', this.imageFile);
      } else if (
        this.productForm.get('image')?.value &&
        typeof this.productForm.get('image')?.value === 'string'
      ) {
        // If no new image but there's an existing image path
        formData.append('existingImage', this.productForm.get('image')?.value);
      }
      try {
        await firstValueFrom(
          this.productService.updateProduct(
            formData,
            this.currentProductId,
            token
          )
        );
        this.toastr.success('Product updated successfully');
        this.resetForm();
        this.getProducts();
      } catch (error: any) {
        console.error('Update Product error:', error);
        if (error.status == 401) {
          this.toastr.error('Session Expired, please init session again');
          this.userService.logout();
        } else if (error.status == 403) {
          this.toastr.error('Forbidden');
        } else {
          this.toastr.error(error.error?.message || 'Error updating product');
        }
      }
    } else {
      this.toastr.warning('Please fill all required fields correctly');
      this.productForm.markAllAsTouched();
    }
  }
}
