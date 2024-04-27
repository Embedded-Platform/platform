import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../enums/auth-status.enum';

export const PrivateGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus() === AuthStatus.authenticated) {
    return true;
  }

  router.navigateByUrl('/login');
  // const url = state.url;
  // localStorage.setItem('url', url); para devolver al usuariuo a donde queria ir

  return false;
};
