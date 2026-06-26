import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { AuthSession, LoginRequest, User } from '@scandiag/contracts';
import { ApiException } from '../common/api-exception';
import { DEMO_ACCOUNTS } from '../data/demo-data';

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;

@Injectable()
export class AuthService {
  private readonly sessions = new Map<string, User>();

  login(credentials: LoginRequest): AuthSession {
    const account = DEMO_ACCOUNTS.find(
      (candidate) =>
        candidate.user.email === credentials.email &&
        candidate.password === credentials.password,
    );
    if (!account) {
      throw ApiException.unauthorized(
        'Identifiants de démonstration invalides.',
      );
    }
    const token = randomUUID();
    this.sessions.set(token, account.user);
    return {
      token,
      user: account.user,
      expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
    };
  }

  getUserByToken(token: string | undefined): User {
    const user = token ? this.sessions.get(token) : undefined;
    if (!user) {
      throw ApiException.unauthorized();
    }
    return user;
  }
}
