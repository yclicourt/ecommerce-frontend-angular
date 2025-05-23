import { Routes } from '@angular/router';
import { Role } from '@features/auth/enums/role.enum';
import { RoleGuard } from 'src/app/core/guard/role-guard.guard';

// Routes for the product feature module
export default [
  {
    path: '',
    loadComponent: () =>
      import('./products/products.component').then((m) => m.ProductsComponent),
    canActivate: [RoleGuard([Role.ADMIN])],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
    canActivate: [RoleGuard([Role.ADMIN])],
  },
] as Routes;
