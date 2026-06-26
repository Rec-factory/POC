import { InjectionToken } from '@angular/core';
import type { ScandiagDevicePort } from '@scandiag/core';

/** Jeton d'injection du port d'appareil SCANDIAG. */
export const SCANDIAG_DEVICE = new InjectionToken<ScandiagDevicePort>(
  'ScandiagDevicePort',
);
