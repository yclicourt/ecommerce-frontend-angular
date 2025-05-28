import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export default class HeaderDashboardComponent implements OnInit {
  userService = inject(UserService);

  ngOnInit(): void {
  }

  logout() {
    this.userService.logout();
  }
}
