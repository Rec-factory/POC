import type { ScandiagDevice } from '@scandiag/contracts';
import type { ScandiagDevicePort } from '../ports/scandiag-device.port';

/** Résultat d'une tentative de connexion à un appareil. */
export interface ConnectDeviceResult {
  device: ScandiagDevice;
  batteryLevel: number | null;
}

/**
 * Recherche les appareils puis se connecte au premier disponible.
 * Lève une erreur si aucun appareil n'est trouvé.
 */
export async function connectFirstAvailableDevice(
  port: ScandiagDevicePort,
): Promise<ConnectDeviceResult> {
  const devices = await port.searchDevices();
  const device = devices[0];
  if (!device) {
    throw new Error('Aucun appareil SCANDIAG simulé trouvé.');
  }
  await port.connect(device.id);
  const batteryLevel = await port.getBatteryLevel();
  return { device, batteryLevel };
}
