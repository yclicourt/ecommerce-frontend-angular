import { Component, inject, OnInit } from '@angular/core';
import { HeaderProduct } from '@shared/common/components/header-products/header-products.component';
import { Usuario } from '@features/auth/interfaces/register.interface';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderProduct],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  route = inject(ActivatedRoute);
  userService = inject(UserService);
  profileData!: Usuario;

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.userService.getUser(param['id']).subscribe((data: Usuario) => {
        this.profileData = data;
      });
    });
  }
}
