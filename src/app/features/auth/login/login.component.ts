import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ForgotPasswordComponent } from "../forgot-password/forgot-password.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, ForgotPasswordComponent,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {

  // Inject Services
  private router = inject(Router);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  accessForm!: FormGroup;

  email: FormControl;
  password: FormControl;

  showPasswordModal = false

  constructor() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', Validators.required);
    this.accessForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }

  // Method login to authenticate the user
  login(): void {
    this.userService.loginUser(this.accessForm.value).subscribe({
      next: (response) => {
        if (response) {
          this.accessForm.reset();
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        const errorMessage =
          error.error?.message || error.message || 'Login Error';

        console.error('Login Error:', error);
        this.toastr.error(errorMessage);
        this.router.navigateByUrl('/error')
      },
      complete: () => {
        this.accessForm.reset();
      },
    });
  }

  // Method to navigate to the register page
  register() {
    this.router.navigate(['register']);
  }

  // Method to open modal for forgot password
  openPasswordModal(event: Event) {
    event.preventDefault();
    this.showPasswordModal = true;
    document.body.style.overflow = 'hidden'; 
  }

  // Method to close modal for forgot password
  onClosePasswordModal() {
    this.showPasswordModal = false;
    document.body.style.overflow = 'auto'; // Habilita el scroll
  }

// Method to handle errors in the form
  hasErrors(field: string, typeError: string) {
    return (
      this.accessForm.get(field)?.hasError(typeError) &&
      this.accessForm.get(field)?.touched
    );
  }
}
