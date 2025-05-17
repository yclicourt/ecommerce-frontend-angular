import { Component, inject, OnInit } from '@angular/core';
import { User } from '@features/auth/interfaces/register.interface';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { HeaderComponent } from "../../shared/common/components/header/header.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ HeaderComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  route = inject(ActivatedRoute);
  userService = inject(UserService);
  profileData!: User;

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.userService.getUser(param['id']).subscribe((data: User) => {
        this.profileData = data;
      });
    });
  }
}
