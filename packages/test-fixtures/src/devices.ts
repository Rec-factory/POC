import type { ScandiagDevice } from '@scandiag/contracts';

/** Appareil SCANDIAG simulé par défaut. */
export const DEFAULT_DEVICE: ScandiagDevice = {
  id: 'scandiag-demo-01',
  name: 'SCANDIAG DEMO 01',
  signalStrength: 82,
};

/** Liste d'appareils détectés dans un scénario nominal. */
export const DEFAULT_DEVICES: readonly ScandiagDevice[] = [DEFAULT_DEVICE];
