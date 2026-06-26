import { type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DemoModeStore } from '../state/demo-mode.store';
import { SessionStore } from '../state/session.store';

/** En-tête transportant le scénario de démonstration actif. */
const SCENARIO_HEADER = 'x-demo-scenario';

/**
 * Ajoute, pour les appels vers l'API simulée, le jeton de session et le
 * scénario de démonstration courant.
 */
export const apiHeadersInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiBaseUrl)) {
    return next(req);
  }

  const session = inject(SessionStore);
  const demoMode = inject(DemoModeStore);

  const headers: Record<string, string> = {
    [SCENARIO_HEADER]: demoMode.scenario(),
  };
  const token = session.token();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return next(req.clone({ setHeaders: headers }));
};
