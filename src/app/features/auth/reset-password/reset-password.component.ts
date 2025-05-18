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
export class ResetPasswordComponent {
  @Output() closeModal = new EventEmitter<void>();
  isLoading = false;

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

    // Obtener el token de la URL al inicializar el componente
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      console.log('Getting token:', this.token);

      if (!this.token) {
        this.showErrorMessage('Reset token not found');
        this.onClose();
      }
    });
  }

  onClose() {
    this.closeModal.emit();
  }

  get Password() {
    return this.resetPasswordForm.get('password');
  }
  onSubmit() {
    // Marcar todos los campos como touched para mostrar errores si existen
    this.resetPasswordForm.markAllAsTouched();

    // Si el formulario es inválido, no proceder
    if (this.resetPasswordForm.invalid || !this.token) {
      if (!this.token) {
        this.showErrorMessage('Invalid reset token');
      }
      return;
    }

    this.isLoading = true;

    // Llamar al servicio para recuperar contraseña
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
        },
      });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
