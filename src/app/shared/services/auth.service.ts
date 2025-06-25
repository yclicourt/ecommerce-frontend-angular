import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';
import { Status } from '@features/auth/enums/status.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  Status = Status;

  // Inject services
  userService = inject(UserService);

  initialize(): void {
    const isAuthenticated = this.userService.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  // Method to notify if login is success or not
  notifyLoginSuccess(): void {
    this.isAuthenticatedSubject.next(true);
  }

  // Method to logout
  logout(): void {
    const currentUserId = this.userService.getCurrentUserId();
    if (currentUserId) {
      this.userService
        .updateUserStatusInBackend(currentUserId, Status.OFFLINE)
        .subscribe({
          next: () => {
            this.performLogout();
          },
          error: () => {
            this.performLogout();
          },
        });
    } else {
      this.performLogout();
    }
  }

  // Method to handle perform logout
  private performLogout(): void {
    this.userService.logout();
    this.isAuthenticatedSubject.next(false);
  }
}
