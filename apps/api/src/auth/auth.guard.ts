import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@scandiag/contracts';
import { AuthService } from './auth.service';

/** Requête enrichie de l'utilisateur authentifié. */
export interface AuthenticatedRequest extends Request {
  user: User;
}

/** Garde exigeant un jeton de session valide (compte de démonstration). */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const header = request.headers.authorization ?? '';
    const token = header.startsWith('Bearer ')
      ? header.slice('Bearer '.length)
      : undefined;
    request.user = this.authService.getUserByToken(token);
    return true;
  }
}
