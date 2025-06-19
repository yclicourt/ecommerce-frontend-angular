import { inject } from '@angular/core';
import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { Status } from '@features/auth/enums/status.enum';
import { UserService } from '@shared/services/user.service';
import { map } from 'rxjs';

export const AuthGuard: CanMatchFn = (
  route,
  segments
): MaybeAsync<GuardResult> => {

  // Inject Services
  const router = inject(Router);

  return inject(UserService).currentUser$.pipe(
    map((user) => {

      // Verify if the user exists and is active
      if (user && user.status === Status.ACTIVE) {
        return true;
      }

      // If the user is not active or does not exist, redirect to login
      return router.createUrlTree(['/auth/login'],{
        queryParams:{
          redirectUrl:segments.join('/'),
          reason: user?.status === Status.INACTIVE ? 'inactive' : 'unauthorized'
        }
      });
    })
  );
};
