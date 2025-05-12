import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './features/product-feature/products/products.component';
import { ProductDetailComponent } from './features/product-feature/product-detail/product-detail.component';
import { AuthGuard } from './core/guard/auth.guard';
import { AuthenticatedGuard } from './core/guard/authenticated.guard';
import { AdminGuard } from './core/guard/admin-guard.guard';
import { Role } from '../app/features/auth/interfaces/role.enum';
import { DashboardAdminComponent } from './pages/dashboard-admin/dashboard-admin.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { roles: [Role.ADMIN, Role.USER] },
  },
  {
    path: 'products',
    loadChildren: () => import('./features/product-feature/product.routes'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes'),
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.USER] },
  },
  {
    path: 'admin/dashboard',
    component: DashboardAdminComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
