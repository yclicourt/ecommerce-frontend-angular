import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '@shared/services/user.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './profile-dashboard.component.html',
  styleUrl: './profile-dashboard.component.css',
})
export default class ProfileDashboardComponent implements OnInit {
  userService = inject(UserService);

  ngOnInit(): void {
    this.getUsersDashboard();
  }

  // Method to get all users on dashboard
  getUsersDashboard() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        console.log(data);
        this.userService.users = data;
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  // Method to get avatar url
  getAvatarUrl(avatarPath:string | null):string{
    if(!avatarPath){
      return '/avatar.svg';
    }
    return `${environment.apiUrl}${avatarPath}`;
  }

  // Handler for error
  handleImageError(event: Event) {
  const imgElement = event.target as HTMLImageElement;
  imgElement.src = '/avatar.svg'; 
}
}
