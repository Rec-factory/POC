import { Injectable, computed, signal } from '@angular/core';
import type { AuthSession, User } from '@scandiag/contracts';

const TOKEN_STORAGE_KEY = 'scandiag.session.token';

/** État de session authentifiée (Angular Signals). */
@Injectable({ providedIn: 'root' })
export class SessionStore {
  private readonly tokenSignal = signal<string | null>(
    this.readPersistedToken(),
  );
  private readonly userSignal = signal<User | null>(null);

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);

  setSession(session: AuthSession): void {
    this.tokenSignal.set(session.token);
    this.userSignal.set(session.user);
    this.persistToken(session.token);
  }

  setUser(user: User): void {
    this.userSignal.set(user);
  }

  clear(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    this.persistToken(null);
  }

  private readPersistedToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  private persistToken(token: string | null): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    if (token === null) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } else {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    }
  }
}
