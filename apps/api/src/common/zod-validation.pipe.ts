import { type PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';
import { ApiException } from './api-exception';

/**
 * Pipe de validation s'appuyant sur les schémas Zod partagés. Garantit
 * que les types acceptés par l'API correspondent aux contrats.
 */
export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      throw ApiException.validation(
        'Les données fournies sont invalides.',
        result.error.flatten(),
      );
    }
    return result.data;
  }
}
