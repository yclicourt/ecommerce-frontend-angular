import { Component, HostListener, inject, OnInit } from '@angular/core';
import { User } from '@features/auth/interfaces/register.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { HeaderComponent } from '../../shared/common/components/header/header.component';
import { CommonModule } from '@angular/common';
import { environment } from '@envs/environment';
import { OrderService } from '@shared/services/order.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export default class ProfileComponent implements OnInit {
  // Injecting services
  route = inject(ActivatedRoute);
  userService = inject(UserService);
  orderService = inject(OrderService);
  router = inject(Router);

  private API_URL = environment.apiUrl;
  showScrollButton = false;
  private scrollThreshold = 300;

  profileData: User;
  statsData: any = {};
  monthlyRevenue: any[] = [];
  currentUserId: number | null = null;

  constructor() {
    this.profileData = {} as User;
  }
  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.userService.getUser(param['id']).subscribe((data: User) => {
        this.profileData = {
          ...data,
          avatar:data.avatar
        };
      });
    });

    const loggedInUserId = this.userService.getCurrentUserId();

    // Check if the user is logged in and has an ID
    this.route.params.subscribe((params) => {
      const requestedUserId = +params['id'];

      // Si no hay ID en la ruta, usar el del usuario logueado
      // If not exists id in route, get a user logged
      if (!requestedUserId && loggedInUserId) {
        this.currentUserId = loggedInUserId;
      }
      // Si hay ID en la ruta, verificar permisos
      // If exists id in route, verify permissions
      else if (requestedUserId) {
        this.currentUserId = requestedUserId;
      }

      if (this.currentUserId) {
        this.loadProfileData();
        this.loadStatsData();
      } else {
        this.router.navigate(['/login']);
      }
    });

    window.addEventListener('scroll', this.onWindowScroll.bind(this));
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

  // Methods to load profile and stats data
  loadProfileData() {
    this.userService.getUser(this.currentUserId!).subscribe((data) => {});
  }

  // Method to load stats and monthly revenue data
  loadStatsData() {
    this.orderService.getOrdersStats(this.currentUserId!).subscribe((stats) => {
      this.statsData = stats;
    });

    this.orderService
      .getMonthlyRevenue(this.currentUserId!)
      .subscribe((revenue) => {
        this.monthlyRevenue = revenue;
      });
  }
}
