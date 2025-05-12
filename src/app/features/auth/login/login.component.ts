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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private router = inject(Router);
  private userService = inject(UserService);

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
      next: () => this.router.navigate(['home']),
      error: (error: HttpErrorResponse) => {
        console.error('Login Error', error.error.message);
      },
    });
    this.accessForm.reset();
  }

  hasErrors(field: string, typeError: string) {
    return (
      this.accessForm.get(field)?.hasError(typeError) &&
      this.accessForm.get(field)?.touched
    );
  }
}
