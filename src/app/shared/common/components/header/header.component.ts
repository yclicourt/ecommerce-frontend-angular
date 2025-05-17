import { Component, inject, OnInit } from '@angular/core';
import { Role } from '@features/auth/interfaces/register.interface';
import { UserService } from '@shared/services/user.service';
import { Router, RouterLink } from '@angular/router';
import { HasRoleDirective } from 'src/app/core/has-role.directive';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, HasRoleDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);
  Role = Role;
  currentUser = toSignal(this.userService.currentUser$);

  ngOnInit(): void {}

  logout(): void {
    this.userService.logout();
  }

  getProfile(id?: number) {
    if (!id) return;
    this.userService.getUser(id).subscribe({
      next: (data) => {
        this.router.navigate(['/profile', data.id]);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }
  hasRole(roles: Role[]) {
    return this.currentUser()?.role?.some((role) => roles.includes(role));
  }
}
