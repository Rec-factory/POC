import { z } from 'zod';

/**
 * État explicite de la connexion à l'appareil. Ne jamais représenter
 * cet état avec plusieurs booléens indépendants.
 */
export const DeviceConnectionStateSchema = z.enum([
  'idle',
  'searching',
  'device-found',
  'connecting',
  'connected',
  'measuring',
  'disconnecting',
  'disconnected',
  'error',
]);
export type DeviceConnectionState = z.infer<typeof DeviceConnectionStateSchema>;

/** Appareil SCANDIAG simulé détecté lors d'une recherche. */
export const ScandiagDeviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Puissance de signal simulée (0 à 100). */
  signalStrength: z.number().min(0).max(100),
});
export type ScandiagDevice = z.infer<typeof ScandiagDeviceSchema>;

/** Photographie de l'état de l'appareil à un instant donné. */
export const DeviceStateSchema = z.object({
  connection: DeviceConnectionStateSchema,
  deviceId: z.string().nullable(),
  batteryLevel: z.number().min(0).max(100).nullable(),
  error: z.string().nullable(),
});
export type DeviceState = z.infer<typeof DeviceStateSchema>;
