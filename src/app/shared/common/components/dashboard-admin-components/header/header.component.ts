import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export default class HeaderDashboardComponent implements OnInit {
  authService = inject(AuthService);
  ngOnInit(): void {}

  logout() {
    this.authService.logout();
  }
}
