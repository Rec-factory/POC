import { z } from 'zod';

/** Nature de la mesure réalisée par le SCANDIAG simulé. */
export const MeasurementTypeSchema = z.enum(['tire', 'brake-disc']);
export type MeasurementType = z.infer<typeof MeasurementTypeSchema>;

/** Position de la roue concernée par la mesure. */
export const WheelPositionSchema = z.enum([
  'front-left',
  'front-right',
  'rear-left',
  'rear-right',
]);
export type WheelPosition = z.infer<typeof WheelPositionSchema>;

/** Statut métier déduit de la valeur mesurée. */
export const MeasurementStatusSchema = z.enum([
  'good',
  'warning',
  'critical',
  'invalid',
]);
export type MeasurementStatus = z.infer<typeof MeasurementStatusSchema>;

/** Qualité technique du relevé renvoyée par l'appareil. */
export const MeasurementQualitySchema = z.enum(['good', 'unstable', 'invalid']);
export type MeasurementQuality = z.infer<typeof MeasurementQualitySchema>;

/**
 * Mesure unique produite par le SCANDIAG. En phase 0, `source` vaut
 * toujours `simulation`.
 */
export const ScandiagMeasurementSchema = z.object({
  id: z.string(),
  type: MeasurementTypeSchema,
  position: WheelPositionSchema,
  value: z.number(),
  unit: z.literal('mm'),
  threshold: z.number(),
  status: MeasurementStatusSchema,
  quality: MeasurementQualitySchema,
  measuredAt: z.string().datetime(),
  source: z.literal('simulation'),
});
export type ScandiagMeasurement = z.infer<typeof ScandiagMeasurementSchema>;

/** Demande de mesure adressée au port d'appareil. */
export const MeasurementRequestSchema = z.object({
  type: MeasurementTypeSchema,
  position: WheelPositionSchema,
});
export type MeasurementRequest = z.infer<typeof MeasurementRequestSchema>;
