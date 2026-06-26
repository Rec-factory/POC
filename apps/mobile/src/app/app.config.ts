import {
  type ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { APP_ROUTES } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideIonicAngular({ mode: 'md' }),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
};
