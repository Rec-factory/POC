import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorSchema, type ApiErrorCode } from '@scandiag/contracts';

/** Erreur typée issue de l'API simulée. */
export class FacomApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ApiErrorCode | string,
    message: string,
    public readonly details: unknown = null,
  ) {
    super(message);
    this.name = 'FacomApiError';
  }
}

/** Convertit une erreur HTTP Angular en `FacomApiError` exploitable. */
export function toFacomApiError(error: unknown): FacomApiError {
  if (error instanceof HttpErrorResponse) {
    const parsed = ApiErrorSchema.safeParse(error.error);
    if (parsed.success) {
      return new FacomApiError(
        parsed.data.statusCode,
        parsed.data.code,
        parsed.data.message,
        parsed.data.details,
      );
    }
    if (error.status === 0) {
      return new FacomApiError(
        0,
        'NETWORK_ERROR',
        "Impossible de joindre l'API FACOM simulée.",
      );
    }
    return new FacomApiError(error.status, 'HTTP_ERROR', error.message);
  }
  return new FacomApiError(
    500,
    'UNKNOWN',
    error instanceof Error ? error.message : 'Erreur inconnue.',
  );
}
