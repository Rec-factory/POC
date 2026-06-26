import { z } from 'zod';

/**
 * Identifiants des scénarios de démonstration déterministes.
 * Un même scénario doit toujours produire le même résultat.
 */
export const DemoScenarioIdSchema = z.enum([
  'nominal',
  'no-device',
  'connection-failed',
  'low-battery',
  'disconnect-during-measurement',
  'measurement-good',
  'measurement-warning',
  'measurement-critical',
  'measurement-invalid',
  'api-slow',
  'api-unavailable',
  'save-rejected',
]);
export type DemoScenarioId = z.infer<typeof DemoScenarioIdSchema>;

export const DEMO_SCENARIO_IDS = DemoScenarioIdSchema.options;
