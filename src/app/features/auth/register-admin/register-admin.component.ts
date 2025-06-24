import { CommonModule, NgClass } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register-admin',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass,CommonModule],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css',
})
export default class RegisterAdminComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Inject Services
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  registerForm: FormGroup;
  name: FormControl;
  lastname: FormControl;
  email: FormControl;
  address: FormControl;
  password: FormControl;
  phone: FormControl;
  avatar: FormControl;
  roles: FormControl;

  loading = false;

  constructor() {
    this.name = new FormControl('', Validators.required);
    this.lastname = new FormControl('', Validators.required);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.address = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
    this.phone = new FormControl('', Validators.required);
    this.avatar = new FormControl(null as File | null);
    this.roles = new FormControl([], Validators.required);
    this.registerForm = new FormGroup({
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      address: this.address,
      password: this.password,
      phone: this.phone,
      avatar: this.avatar,
      role: this.roles,
    });
  }

  // Method to handle file selection
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.registerForm.patchValue({ avatar: file });
      this.registerForm.get('avatar')?.updateValueAndValidity();
    }
  }

  // Method to register a user
  async register() {
    this.loading = true;
    if (this.registerForm.valid) {
      const formData = new FormData();

      // Add all form fields to the FormData object
      Object.keys(this.registerForm.controls).forEach((key) => {
        if (key === 'avatar') return;

        const value = this.registerForm.get(key)?.value;

        if (key === 'role' && Array.isArray(value)) {
          value.forEach((r: string) => formData.append('role[]', r));
        } else {
          formData.append(key, value);
        }
      });

      // Add the avatar file
      const avatarFile = this.registerForm.get('avatar')?.value;
      if (avatarFile instanceof File) {
        formData.append('avatar', avatarFile);
      }

      try {
        await firstValueFrom(this.userService.registerAdminUser(formData));
        this.toastr.success('User registered successfully');
        this.router.navigate(['/login']);

        this.registerForm.reset();
      } catch (error: any) {
        this.loading = false;
        console.error('Registration error:', error);
        this.toastr.error(error.error?.message || 'Registration failed');
      }
    } else {
      this.toastr.warning('Please fill all required fields correctly');
      this.registerForm.markAllAsTouched();
    }
  }

  // Method to check if a field has errors
  hasErrors(field: string, typeError: string) {
    return (
      this.registerForm.get(field)?.hasError(typeError) &&
      this.registerForm.get(field)?.touched
    );
  }
}
