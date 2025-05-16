import { inject } from '@angular/core';
import { CanMatchFn, GuardResult, MaybeAsync, Router } from '@angular/router';
import { UserService } from '@shared/services/user.service';
import { map } from 'rxjs';

export const AuthGuard: CanMatchFn = (
  route,
  segments
): MaybeAsync<GuardResult> => {
  const router = inject(Router);

  return inject(UserService).currentUser$.pipe(
    map((user) => {
      if (user) {
        return true;
      }

      return router.createUrlTree(['/auth/login']);
    })
  );
};
