import type {
  DeviceState,
  MeasurementRequest,
  ScandiagDevice,
  ScandiagMeasurement,
} from '@scandiag/contracts';

/**
 * Port d'accès à l'appareil SCANDIAG. En phase 0, la seule
 * implémentation autorisée est `MockScandiagAdapter`.
 */
export interface ScandiagDevicePort {
  isAvailable(): Promise<boolean>;
  searchDevices(): Promise<ScandiagDevice[]>;
  connect(deviceId: string): Promise<void>;
  disconnect(): Promise<void>;
  getState(): DeviceState;
  getBatteryLevel(): Promise<number | null>;
  startMeasurement(request: MeasurementRequest): Promise<ScandiagMeasurement>;
}
