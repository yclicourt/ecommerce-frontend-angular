import { Component, HostListener, inject, OnInit } from '@angular/core';
import { User } from '@features/auth/interfaces/register.interface';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { HeaderComponent } from '../../shared/common/components/header/header.component';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  route = inject(ActivatedRoute);
  userService = inject(UserService);
  profileData: User;
  private API_URL = environment.apiUrl;
  showScrollButton = false;
  private scrollThreshold = 300;

  constructor() {
    this.profileData = {} as User;
  }
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.userService.getUser(param['id']).subscribe((data: User) => {
        this.profileData = {
          ...data,
          avatar: data.avatar ? `${this.API_URL}${data.avatar}` : 'avatar.svg',
        };
      });
    });
  }

  // Method to check scroll position
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkScroll();
  }
  // Check if the scroll is greater than threshold
  checkScroll() {
    this.showScrollButton = window.pageYOffset > this.scrollThreshold;
  }

  // Scroll to top of the page
  scrollToTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
}
