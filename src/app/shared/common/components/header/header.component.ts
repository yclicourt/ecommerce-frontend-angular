import { Component, inject, OnInit } from '@angular/core';
import { Usuario } from '@features/auth/interfaces/register.interface';
import { UserService } from '@shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);
  selectedProfile!: Usuario;

  ngOnInit(): void {}

  logout(): void {
    this.userService.logout();
  }

  getProfile(id: number) {
    this.userService.getUser(id).subscribe({
      next: (data) => {
        this.selectedProfile = data;
        this.router.navigate(['/profile', data.id]);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }
}
