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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '@shared/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@shared/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '@features/product-feature/interfaces/Product';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Category } from '@features/product-feature/interfaces/category.interface';
import { CategoryService } from '@shared/services/category.service';
import { CategoryName } from './enums/category-name.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  name: FormControl;
  description: FormControl;
  price: FormControl;
  image: FormControl;

  availableCategories: Category[] = [];
  categoryNames = Object.values(CategoryName);
  selectedCategoryName: CategoryName | null = null;
  selectedCategories: Array<{
    name: CategoryName;
    description?: string;
  }> = [];

  isEditMode: boolean = false;
  currentProductId: number | undefined;
  imageFile: File | null = null;
  currentImageUrl: string | null = null;

  @Input() productToEdit: Product | null = null;

  public productService = inject(ProductService);
  private API_URL = environment.apiUrl;
  private toastr = inject(ToastrService);
  private userService = inject(UserService);
  private categoriesService = inject(CategoryService);
  private router = inject(Router)

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
    this.loadAvailableCategories();
  }

  // Method to create product
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

      // Agregar categorías como array de objetos (no solo IDs)
      if (this.selectedCategories.length > 0) {
        formData.append(
          'categories',
          JSON.stringify(
            this.selectedCategories.map((c) => ({
              name: c.name,
              description: c.description || undefined,
            }))
          )
        );
      }
      // Add the image file
      if (this.imageFile) {
        formData.append('image', this.imageFile);
      }

      try {
        // Create a product
        const newProduct = await firstValueFrom(
          this.productService.createProduct(formData, token)
        );
        this.toastr.success('Product added successfully');

        // Create categories asociate to product
        if (this.selectedCategories.length > 0) {
          const categoryRequests = this.selectedCategories.map((category) => {
            return firstValueFrom(
              this.categoriesService.createCategory({
                name: category.name,
                productId: newProduct.id!,
              })
            );
          });

          await Promise.all(categoryRequests);
          this.toastr.success('Categories added successfully');
        }
        this.getProducts();
        this.productForm.reset();
      } catch (error: any) {
        console.error('Create Product error:', error);
        this.toastr.error(error.error?.message || 'Registration failed');
        this.router.navigateByUrl('/error')
      }
    } else {
      this.toastr.warning('Please fill all required fields correctly');
      this.productForm.markAllAsTouched();
    }
  }

  // Method to get image based on url
  getFullImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) return '/assets/no-image.png';
    if (imagePath.startsWith('blob:')) return imagePath;
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.API_URL}/${imagePath.replace(/^\//, '')}`;
  }

  // Method to load image
  loadProductImage() {
    if (this.productForm.get('image')?.value) {
      this.currentImageUrl = this.getFullImageUrl(
        this.productForm.get('image')?.value
      );
    }
  }
  // Method to get all products
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

  // Method to manage changes on input images
  ngOnChanges(changes: SimpleChanges) {
    if (changes['productToEdit'] && this.productToEdit) {
      this.loadProductForEdit(this.productToEdit);
    }
  }

  // Method to manage changes on input images
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

  // Method to load product for editing
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
    this.selectedCategories = product.categories
      ? product.categories
          .map((cat) => ({
            name: (cat.name as string).toUpperCase() as CategoryName,
            description: cat.description,
          }))
          .filter((cat) => Object.values(CategoryName).includes(cat.name))
      : [];
  }

  // Method to reset Form
  resetForm() {
    this.isEditMode = false;
    this.currentProductId = undefined;
    this.productForm.reset();
  }

  // Method to update product
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

      // Category management
      if (this.selectedCategories.length > 0) {
        const categoriesToSend = this.selectedCategories.map((category) => ({
          name: category.name.toUpperCase(),
          description: category.description || undefined,
        }));

        const validCategories = categoriesToSend.filter((cat) =>
          Object.values(CategoryName).includes(cat.name as CategoryName)
        );

        if (validCategories.length !== categoriesToSend.length) {
          this.toastr.error('One or more categories are invalid');
          return;
        }
        console.log(validCategories);
        formData.append('categories', JSON.stringify(validCategories));
      }

      // Add the image file if a new one was selected
      if (this.imageFile) {
        formData.append('image', this.imageFile);
      } else if (
        this.productForm.get('image')?.value &&
        typeof this.productForm.get('image')?.value === 'string'
      ) {
        // If no new image but there's an existing image path
        formData.append('image', this.productForm.get('image')?.value);
      }
      try {
        const updatedProduct = await firstValueFrom(
          this.productService.updateProduct(
            formData,
            this.currentProductId,
            token
          )
        );
        if (updatedProduct.categories) {
          this.selectedCategories = updatedProduct.categories.map((cat) => ({
            name: cat.name as CategoryName,
            description: cat.description,
          }));
        } else {
          this.selectedCategories = [];
        }

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
          this.router.navigateByUrl('/error')
        }
      }
    } else {
      this.toastr.warning('Please fill all required fields correctly');
      this.productForm.markAllAsTouched();
    }
  }

  // Method to load categories
  loadAvailableCategories() {
    this.categoriesService.getAllCategories().subscribe({
      next: (data) => {
        this.availableCategories = data;
      },
      error: (err) => {
        console.error('Error loading categories', err);
      },
    });
  }

  // Method to remove category
  removeCategory(index: number) {
    this.selectedCategories.splice(index, 1);
  }

  // Method to handle a categories
  addCategory() {
    if (this.selectedCategoryName) {
      const categoryName = this.selectedCategoryName.toUpperCase();

      // Verificar que el valor es válido
      if (!Object.values(CategoryName).includes(categoryName as CategoryName)) {
        this.toastr.error('Invalid category selected');
        return;
      }

      if (!this.selectedCategories.some((c) => c.name === categoryName)) {
        this.selectedCategories.push({
          name: categoryName as CategoryName,
          description: undefined,
        });
        this.selectedCategoryName = null;
      }
    }
  }
}
