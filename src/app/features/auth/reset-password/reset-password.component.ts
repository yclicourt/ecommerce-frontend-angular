import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export default class ResetPasswordComponent {
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;

  // Inject Services
  userService = inject(UserService);
  snackBar = inject(MatSnackBar);
  route = inject(ActivatedRoute);
  router = inject(Router)

  token: string = '';

  password: FormControl;
  resetPasswordForm: FormGroup;

  constructor() {
    this.password = new FormControl('', Validators.required);
    this.resetPasswordForm = new FormGroup({
      password: this.password,
    });

    // Get the token from the URL when the component is initialized
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      console.log('Getting token:', this.token);

      if (!this.token) {
        this.showErrorMessage('Reset token not found');
        this.onClose();
      }
    });
  }

  // Close the modal
  onClose() {
    this.closeModal.emit();
  }

  // Getters for form controls
  get Password() {
    return this.resetPasswordForm.get('password');
  }
  onSubmit() {
    // Marck all fields as touched to show errors if they exist
    this.resetPasswordForm.markAllAsTouched();

    // If the form is invalid, do not proceed
    if (this.resetPasswordForm.invalid || !this.token) {
      if (!this.token) {
        this.showErrorMessage('Invalid reset token');
      }
      return;
    }

    this.isLoading = true;

    // Call the service to reset the password
    this.userService
      .resetPassword(this.token, this.resetPasswordForm.value)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccessMessage('Password reset successfully');
          this.onClose();
          this.router.navigateByUrl('/login')
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrorMessage(error.message || 'Error reset password');
          this.router.navigateByUrl('/error')
        },
      });
  }

  // Show success message
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
