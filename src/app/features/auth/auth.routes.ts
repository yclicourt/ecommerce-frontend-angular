import { Routes } from '@angular/router';
import { AuthenticatedGuard } from 'src/app/core/guard/authenticated.guard';
import { Role } from './interfaces/role.enum';

const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [AuthenticatedGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
    data: { roles: [Role.ADMIN] },
  },
];

export default authRoutes;
