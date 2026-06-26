import { Injectable, inject } from '@angular/core';
import type { LoginRequest } from '@scandiag/contracts';
import { FACOM_API } from '../api/facom-api.token';
import { SessionStore } from '../state/session.store';

/** Orchestration de l'authentification (port + store de session). */
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly api = inject(FACOM_API);
  private readonly session = inject(SessionStore);

  async login(credentials: LoginRequest): Promise<void> {
    const authSession = await this.api.login(credentials);
    this.session.setSession(authSession);
  }

  logout(): void {
    this.session.clear();
  }
}
