import { HttpException } from '@nestjs/common';
import { API_ERROR_CODES, type ApiErrorCode } from '@scandiag/contracts';

/**
 * Exception métier produisant le format d'erreur structuré attendu :
 * `{ statusCode, code, message, details }`.
 */
export class ApiException extends HttpException {
  constructor(
    statusCode: number,
    public readonly code: ApiErrorCode,
    message: string,
    public readonly details: unknown = null,
  ) {
    super({ statusCode, code, message, details }, statusCode);
  }

  static unauthorized(message = 'Authentification requise.'): ApiException {
    return new ApiException(401, API_ERROR_CODES.UNAUTHORIZED, message);
  }

  static notFound(message: string): ApiException {
    return new ApiException(404, API_ERROR_CODES.NOT_FOUND, message);
  }

  static validation(message: string, details: unknown): ApiException {
    return new ApiException(
      400,
      API_ERROR_CODES.VALIDATION_FAILED,
      message,
      details,
    );
  }

  static unavailable(
    message = 'Le service FACOM simulé est indisponible.',
  ): ApiException {
    return new ApiException(503, API_ERROR_CODES.API_UNAVAILABLE, message);
  }

  static saveRejected(
    message = 'La sauvegarde a été refusée par le service simulé.',
  ): ApiException {
    return new ApiException(422, API_ERROR_CODES.SAVE_REJECTED, message);
  }
}
