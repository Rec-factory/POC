import { z } from 'zod';

/** Véhicule fictif rattaché à un compte de démonstration. */
export const VehicleSchema = z.object({
  id: z.string(),
  /** Plaque d'immatriculation fictive. */
  licensePlate: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.number().int(),
  vin: z.string(),
  mileageKm: z.number().int().nonnegative(),
});
export type Vehicle = z.infer<typeof VehicleSchema>;
