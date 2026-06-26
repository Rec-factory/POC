import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  type AuthSession,
  LoginRequestSchema,
  type LoginRequest,
  type User,
} from '@scandiag/contracts';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { AuthGuard, type AuthenticatedRequest } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Connexion avec un compte de démonstration. */
  @Post('login')
  login(
    @Body(new ZodValidationPipe(LoginRequestSchema))
    credentials: LoginRequest,
  ): AuthSession {
    return this.authService.login(credentials);
  }

  /** Utilisateur de la session courante. */
  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() request: AuthenticatedRequest): User {
    return request.user;
  }
}
