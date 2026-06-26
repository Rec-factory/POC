import { InjectionToken } from '@angular/core';
import type { FacomApiPort } from '@scandiag/core';

/**
 * Jeton d'injection du port d'API. Les pages dépendent de ce port et
 * jamais d'une implémentation concrète.
 */
export const FACOM_API = new InjectionToken<FacomApiPort>('FacomApiPort');
