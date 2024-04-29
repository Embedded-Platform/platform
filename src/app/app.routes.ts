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
    path: 'validate-code',
    canActivate: [PublicGuard],
    loadComponent: () =>
      import('./auth/pages/validateCode/validate-code.component').then(
        (m) => m.ValidateCodeComponent
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
