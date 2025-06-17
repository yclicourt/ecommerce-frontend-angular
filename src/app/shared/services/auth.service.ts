import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';
import { Status } from '@features/auth/enums/status.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  Status= Status

  // Inject services
  userService = inject(UserService)


  initialize(): void {
    const isAuthenticated = this.userService.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  notifyLoginSuccess(): void {
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    const currentUserId = this.userService.getCurrentUserId();
    if (currentUserId) {
      this.userService.updateUserStatusInBackend(currentUserId, Status.INACTIVE)
        .subscribe({
          next: () => {
            this.performLogout();
          },
          error: (err: any) => {
            console.error('Error updating user status:', err);
            this.performLogout();
          }
        });
    } else {
      this.performLogout();
    }
  }

  private performLogout(): void {
    this.userService.logout();
    this.isAuthenticatedSubject.next(false);
  }
}
