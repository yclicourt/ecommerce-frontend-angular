import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { Role } from '../../auth/interfaces/role.enum';

const router = inject(Router);
export const AdminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);

  // Check if the user is authenticated
  if (!userService.isAuthenticated()) {
    router.navigate(['login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
  // Check if the user has the required role
  const requiredRole = route.data['role'] as Role;

  // If there is no role required, allow access
  if (!requiredRole) {
    return true;
  }

  //Get role of current user
  const userRole = userService.getCurrentUserRole();

  // Redirect according to role
  const requiredRoles = route.data['roles'] as Role[];

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    redirectBasedOnRole(userRole);
    return false;
  }

  return true;
};


const redirectBasedOnRole = (role: Role) => {
  const routes = {
    [Role.ADMIN]: '**',
    [Role.MANAGER]: 'dashboard',
    [Role.USER]: '',
    [Role.GUEST]: '',
  };

  router.navigate([routes[role] || 'login']);
};
