import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './core/guard/auth.guard';
import { AuthenticatedGuard } from './core/guard/authenticated.guard';
import { AdminGuard } from './core/guard/admin-guard.guard';
import { Role } from './auth/interfaces/role.enum';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { roles: [Role.ADMIN, Role.GUEST, Role.MANAGER, Role.USER] },
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthenticatedGuard],
  },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER] },
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER] },
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.ADMIN, Role.MANAGER] },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
