import { z } from 'zod';

/** Format d'erreur structuré renvoyé par l'API simulée. */
export const ApiErrorSchema = z.object({
  statusCode: z.number().int(),
  code: z.string(),
  message: z.string(),
  details: z.unknown().nullable(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

/** Codes d'erreur stables exposés par l'API. */
export const API_ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  API_UNAVAILABLE: 'API_UNAVAILABLE',
  SAVE_REJECTED: 'SAVE_REJECTED',
} as const;

export type ApiErrorCode =
  (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
