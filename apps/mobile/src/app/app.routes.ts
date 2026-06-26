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
    path: 'vehicles/:vehicleId/inspection',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/inspection/inspection.page').then(
        (m) => m.InspectionPage,
      ),
  },
  {
    path: 'vehicles/:vehicleId/inspection/result',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/inspection/inspection-result.page').then(
        (m) => m.InspectionResultPage,
      ),
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
    path: 'demo',
    loadComponent: () =>
      import('./pages/demo/demo.page').then((m) => m.DemoPage),
  },
  {
    path: '',
    redirectTo: 'vehicles',
    pathMatch: 'full',
  },
];
