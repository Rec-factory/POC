import {
  type ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { APP_ROUTES } from './app.routes';
import { FACOM_API } from './core/api/facom-api.token';
import { HttpFacomApiAdapter } from './core/api/http-facom-api.adapter';
import { SCANDIAG_DEVICE } from './core/device/scandiag-device.token';
import { MockScandiagAdapter } from './core/device/mock-scandiag.adapter';
import { apiHeadersInterceptor } from './core/interceptors/api-headers.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideIonicAngular({ mode: 'md' }),
    provideRouter(
      APP_ROUTES,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
    ),
    provideHttpClient(withInterceptors([apiHeadersInterceptor])),
    { provide: FACOM_API, useExisting: HttpFacomApiAdapter },
    { provide: SCANDIAG_DEVICE, useExisting: MockScandiagAdapter },
  ],
};
