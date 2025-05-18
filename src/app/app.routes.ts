import { Routes } from '@angular/router';
import { AdminGuard } from './core/guard/admin-guard.guard';
import { Role } from '../app/features/auth/interfaces/role.enum';
import { AuthGuard } from './core/guard/authenticated.guard';
import { RoleGuard } from './core/guard/role-guard.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    canMatch: [AuthGuard],
  },
  {
    path: '',
    loadComponent: () =>
      import('@features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'products',
    loadChildren: () => import('@features/product-feature/product.routes'),
    canMatch: [AuthGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('@features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('@features/auth/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('@features/auth/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [RoleGuard([Role.ADMIN, Role.USER])],
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./pages/dashboard-admin/dashboard-admin.component').then(
        (m) => m.DashboardAdminComponent
      ),
    canActivate: [RoleGuard([Role.ADMIN])],
  },
  {
    path: 'user/dashboard',
    loadComponent: () =>
      import('./pages/dashboard-user/dashboard-user.component').then(
        (m) => m.DashboardUserComponent
      ),
    canActivate: [RoleGuard([Role.USER])],
  },

  { path: '**', redirectTo: '', pathMatch: 'full' },
];
