import { z } from 'zod';

/** Identifiants de connexion. Comptes de démonstration uniquement. */
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

/** Rôle d'un compte de démonstration. */
export const UserRoleSchema = z.enum(['technician', 'demo']);
export type UserRole = z.infer<typeof UserRoleSchema>;

/** Utilisateur de démonstration (aucune donnée personnelle réelle). */
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  role: UserRoleSchema,
});
export type User = z.infer<typeof UserSchema>;

/** Session authentifiée renvoyée par l'API simulée. */
export const AuthSessionSchema = z.object({
  token: z.string(),
  user: UserSchema,
  expiresAt: z.string().datetime(),
});
export type AuthSession = z.infer<typeof AuthSessionSchema>;
