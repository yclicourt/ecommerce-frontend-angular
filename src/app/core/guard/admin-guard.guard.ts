import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isAuthenticated() && userService.hasRole()) {
    return true;
  }
  router.navigate(['login']);
  return false;
};
