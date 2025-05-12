import { Routes } from '@angular/router';
import { AdminGuard } from 'src/app/core/guard/admin-guard.guard';
import { AuthGuard } from 'src/app/core/guard/auth.guard';

const productRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./products/products.component').then((m) => m.ProductsComponent),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
];

export default productRoutes ;
