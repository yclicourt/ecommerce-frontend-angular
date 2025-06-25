    import { inject } from '@angular/core';
    import { CanActivateFn, Router } from '@angular/router';
    import { UserService } from '@shared/services/user.service';
    import { Role } from '@features/auth/enums/role.enum';


    export const AdminGuard: CanActivateFn = (route, state) => {

      // Inject Services
      const userService = inject(UserService);
      const router = inject(Router);

      // Check if the user is authenticated
      if (!userService.isAuthenticated()) {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
      // Check if the user has the required role
      const requiredRole = route.data['roles'] as Role;

      // If there is no role required, allow access
      if (!requiredRole) {
        return true;
      }

      //Get role of current user
      const userRole = userService.getCurrentUserRole();

      // Redirect according to role
      const requiredRoles = route.data['roles'] as Role[];

      if (requiredRoles && !requiredRoles.includes(userRole)) {
        switch(userRole){
          case Role.ADMIN:
            router.navigate(['**'])
            break
          case Role.USER:
            router.navigate(['user/dashboard'])
          
        }
        return false;
      }

      return true;
    };

