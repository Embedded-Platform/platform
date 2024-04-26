import { Routes } from '@angular/router';
import { PublicGuard, PrivateGuard } from './auth/guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [PublicGuard],
    loadComponent: () =>
      import('./auth/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    canActivate: [PublicGuard],
    loadComponent: () =>
      import('./auth/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'dashboard',
    canActivate: [PrivateGuard],
    loadComponent: () =>
      import('./dashboard/pages/dashboard.component').then(
        (m) => m.ChangeDetectionComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
