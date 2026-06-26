import { z } from 'zod';
import { ScandiagMeasurementSchema } from './measurement';

/** État d'un contrôle. */
export const InspectionStatusSchema = z.enum(['in-progress', 'completed']);
export type InspectionStatus = z.infer<typeof InspectionStatusSchema>;

/** Contrôle rattaché à un véhicule et à un technicien. */
export const InspectionSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  technicianId: z.string(),
  status: InspectionStatusSchema,
  measurements: z.array(ScandiagMeasurementSchema),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});
export type Inspection = z.infer<typeof InspectionSchema>;

/** Demande de création d'un contrôle. */
export const CreateInspectionRequestSchema = z.object({
  vehicleId: z.string(),
});
export type CreateInspectionRequest = z.infer<
  typeof CreateInspectionRequestSchema
>;
