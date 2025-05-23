import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink,CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;

  userService = inject(UserService);
  snackBar = inject(MatSnackBar);

  email: FormControl;
  forgotPasswordForm: FormGroup;
  constructor() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.forgotPasswordForm = new FormGroup({
      email: this.email,
    });
  }

  // Close the modal
  onClose() {
    this.closeModal.emit();
  }

  // Getters for form controls
  get Email() {
    return this.forgotPasswordForm.get('email');
  }
  onSubmit() {
    // Mark all fields as touched to show errors if they exist
    this.forgotPasswordForm.markAllAsTouched();

    // If the form is invalid, do not proceed
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Call the service to reset the password
    this.userService
      .forgotPassword(this.forgotPasswordForm.value.email)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccessMessage('Password reset link sent to your email');
          this.onClose();
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrorMessage(error.message || 'Error sending reset link');
        },
      });
  }

  // Show success and error messages
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  // Show error message
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
