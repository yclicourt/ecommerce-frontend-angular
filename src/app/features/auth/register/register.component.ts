import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '@shared/services/user.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  registerForm: FormGroup;
  name: FormControl;
  lastname: FormControl;
  email: FormControl;
  address: FormControl;
  password: FormControl;
  phone: FormControl;

  constructor() {
    this.name = new FormControl('', Validators.required);
    this.lastname = new FormControl('', Validators.required);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.address = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
    this.phone = new FormControl('', Validators.required);
    this.registerForm = new FormGroup({
      name: this.name,
      lastname: this.lastname,
      email: this.email,
      address: this.address,
      password: this.password,
      phone: this.phone,
    });
  }

  register() {
    this.userService.registerUser(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['login']),
      error: (error: HttpErrorResponse) => {
        console.error('Register error', error.error.message);
      },
    });
    this.registerForm.reset();
  }
  hasErrors(field: string, typeError: string) {
    return (
      this.registerForm.get(field)?.hasError(typeError) &&
      this.registerForm.get(field)?.touched
    );
  }
}
