import { Routes } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { AdminGuard } from './core/guard/admin-guard.guard';
import { Role } from '../app/features/auth/interfaces/role.enum';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    data: { roles: [Role.ADMIN, Role.USER] },
  },
  {
    path: '',
    loadComponent: () =>
      import('@features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate:[AdminGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('@features/product-feature/product.routes'),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.USER] },
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./pages/dashboard-admin/dashboard-admin.component').then(
        (m) => m.DashboardAdminComponent
      ),
    canActivate: [AuthGuard, AdminGuard],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
