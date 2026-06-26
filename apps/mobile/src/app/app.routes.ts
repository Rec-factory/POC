import type { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'vehicles',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/vehicles/vehicles.page').then((m) => m.VehiclesPage),
  },
  {
    path: 'vehicles/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/vehicles/vehicle-detail.page').then(
        (m) => m.VehicleDetailPage,
      ),
  },
  {
    path: '',
    redirectTo: 'vehicles',
    pathMatch: 'full',
  },
];
