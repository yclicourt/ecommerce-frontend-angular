import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { inject } from '@angular/core';

export const AuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isAuthenticated()) {
    return true;
  }else{
    return router.navigate(['login'])
  }
};
