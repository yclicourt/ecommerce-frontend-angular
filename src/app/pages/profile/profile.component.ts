import { Component, inject, OnInit } from '@angular/core';
import { User } from '@features/auth/interfaces/register.interface';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { HeaderComponent } from '../../shared/common/components/header/header.component';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  route = inject(ActivatedRoute);
  userService = inject(UserService);
  profileData: User;
  private API_URL = environment.apiUrl;

  constructor() {
    this.profileData = {} as User;
  }
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.userService.getUser(param['id']).subscribe((data: User) => {
        this.profileData = {
          ...data,
          avatar: data.avatar
            ? `${this.API_URL}${data.avatar}`
            : 'avatar.svg',
        };
      });
    });
  }
}
