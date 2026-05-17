import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Protege rutas de administración: exige sesión Firebase o uid en localStorage. */
export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const allowed = await auth.isAuthenticatedSnapshot();
  return allowed ? true : router.createUrlTree(['/login']);
};
