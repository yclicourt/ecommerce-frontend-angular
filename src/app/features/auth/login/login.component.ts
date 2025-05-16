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
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private toastr = inject(ToastrService);

  accessForm!: FormGroup;

  email: FormControl;
  password: FormControl;

  constructor() {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', Validators.required);
    this.accessForm = new FormGroup({
      email: this.email,
      password: this.password,
    });
  }
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
      },
      complete: () => {
        this.accessForm.reset();
      },
    });
  }

  register() {
    this.router.navigate(['register']);
  }
  hasErrors(field: string, typeError: string) {
    return (
      this.accessForm.get(field)?.hasError(typeError) &&
      this.accessForm.get(field)?.touched
    );
  }
}
