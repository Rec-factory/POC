import { NestFactory } from '@nestjs/core';
import type { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { ApiExceptionFilter } from './common/api-exception.filter';
import { ScenarioInterceptor } from './common/scenario';

/**
 * Construit l'application NestJS configurée. Extrait du bootstrap pour
 * être réutilisable dans les tests.
 */
export async function createApp(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalFilters(new ApiExceptionFilter());
  app.useGlobalInterceptors(new ScenarioInterceptor());
  return app;
}
