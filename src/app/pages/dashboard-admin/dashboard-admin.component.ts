import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '@features/auth/interfaces/register.interface';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
})
export class DashboardAdminComponent {
  public userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  selectedProfile!: Usuario;

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
