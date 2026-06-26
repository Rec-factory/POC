import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { SessionStore } from '../state/session.store';

/** Redirige vers la connexion si aucune session n'est active. */
export const authGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);
  if (session.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
