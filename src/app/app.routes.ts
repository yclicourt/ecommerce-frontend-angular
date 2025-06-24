import { Routes } from '@angular/router';
import { AdminGuard } from './core/guard/admin-guard.guard';
import { Role } from './features/auth/enums/role.enum';
import { AuthGuard } from './core/guard/authenticated.guard';
import { RoleGuard } from './core/guard/role-guard.guard';

// Routes for the application
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component'),
    canMatch: [AuthGuard],
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.component'),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component'),
  },
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login/login.component'),
  },
  {
    path: 'products',
    loadChildren: () => import('@features/product-feature/product.routes'),
    canMatch: [AuthGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('@features/auth/register/register.component'),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('@features/auth/forgot-password/forgot-password.component'),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('@features/auth/reset-password/reset-password.component'),
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./pages/profile/profile.component'),
    canActivate: [RoleGuard([Role.ADMIN, Role.USER])],
  },
  {
    path: 'admin/dashboard/layout',
    loadComponent: () =>
      import(
        '@shared/common/components/dashboard-admin-components/layout/layout.component'
      ),
    children: [
      {
        path: 'dashboard-graph',
        loadComponent: () =>
          import('./components/dashboard-graph/dashboard-graph.component'),
      },
      {
        path: 'profiles',
        loadComponent: () =>
          import('./components/profile-dashboard/profile-dashboard.component'),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/product-dashboard/product-dashboard.component'),
      },
    ],
    canActivate: [RoleGuard([Role.ADMIN])],
  },
  {
    path: 'admin/register',
    loadComponent: () =>
      import('@features/auth/register-admin/register-admin.component'),
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('@shared/common/components/not-found/not-found.component'),
  },
  {
    path: 'error',
    loadComponent: () =>
      import(
        '@shared/common/components/internal-server-error/internal-server-error.component'
      ),
  },
  {
    path: 'order/success',
    loadComponent: () => import('@features/orders/orders.component'),
    canActivate: [AuthGuard],
  },

  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
