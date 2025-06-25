import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import ForgotPasswordComponent from '../forgot-password/forgot-password.component';
import { catchError, filter, finalize, of, switchMap, take, tap } from 'rxjs';
import { Status } from '../enums/status.enum';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    ForgotPasswordComponent,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export default class LoginComponent {
  // Inject Services
  private router = inject(Router);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);
  Status!: Status;

  accessForm!: FormGroup;

  email: FormControl;
  password: FormControl;

  showPasswordModal = false;
  loading = false;

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
    this.loading = true;

    this.userService
      .loginUser(this.accessForm.value)
      .pipe(
        switchMap(() => this.userService.currentUser$),
        filter((user) => !!user),
        take(1),
        tap((user) => {
          console.log('💡 Usuario cargado:', user);
          if (user.status === Status.ACTIVE) {
            this.router.navigate(['/home']);
          } else {
            this.toastr.error('Inactive User');
            this.router.navigateByUrl('/error');
          }
        }),
        finalize(() => (this.loading = false)),
        catchError((err) => {
          console.error(err);
          this.toastr.error('Login Error');
          return of(null);
        })
      )
      .subscribe();
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
