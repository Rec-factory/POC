import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiError } from '@scandiag/contracts';

/**
 * Transforme toute exception en réponse d'erreur structurée et stable.
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const body: ApiError =
        typeof payload === 'object' && payload !== null && 'code' in payload
          ? (payload as ApiError)
          : {
              statusCode: status,
              code: 'HTTP_ERROR',
              message:
                typeof payload === 'string' ? payload : exception.message,
              details: null,
            };
      response.status(status).json(body);
      return;
    }

    const body: ApiError = {
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message: 'Erreur interne du service simulé.',
      details: null,
    };
    response.status(500).json(body);
  }
}
