import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Role } from '@features/auth/enums/role.enum';
import { UserService } from '@shared/services/user.service';
import { map } from 'rxjs';

export const RoleGuard = (roles: Role[]): CanActivateFn => {
  return () => {
    return inject(UserService).currentUser$.pipe(
      map((user) => !!user?.role?.some((role) => roles.includes(role)))
    );
  };
};
