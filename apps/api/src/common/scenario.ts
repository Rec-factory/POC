import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { type Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { type DemoScenarioId, DemoScenarioIdSchema } from '@scandiag/contracts';
import { ApiException } from './api-exception';

/** En-tête HTTP transportant le scénario de démonstration actif. */
export const SCENARIO_HEADER = 'x-demo-scenario';

/** Latence simulée appliquée par le scénario « API lente ». */
export const SLOW_API_DELAY_MS = 2000;

/** Résout le scénario depuis un en-tête, avec repli sur `nominal`. */
export function resolveScenario(header: unknown): DemoScenarioId {
  const candidate = Array.isArray(header) ? header[0] : header;
  const parsed = DemoScenarioIdSchema.safeParse(candidate);
  return parsed.success ? parsed.data : 'nominal';
}

/**
 * Applique les scénarios qui concernent l'API : indisponibilité et
 * latence. Les scénarios liés à l'appareil sont gérés côté simulateur.
 */
@Injectable()
export class ScenarioInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const scenario = resolveScenario(request.headers[SCENARIO_HEADER]);

    if (scenario === 'api-unavailable') {
      throw ApiException.unavailable();
    }

    if (scenario === 'api-slow') {
      return next.handle().pipe(delay(SLOW_API_DELAY_MS));
    }

    return next.handle();
  }
}
