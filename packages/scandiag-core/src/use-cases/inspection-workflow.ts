import type { Inspection, MeasurementRequest } from '@scandiag/contracts';
import type { FacomApiPort } from '../ports/facom-api.port';
import type { ScandiagDevicePort } from '../ports/scandiag-device.port';

/**
 * Orchestration d'un contrôle. Le cas d'usage dépend des ports et
 * ignore totalement les implémentations concrètes.
 */
export class InspectionWorkflow {
  constructor(
    private readonly api: FacomApiPort,
    private readonly device: ScandiagDevicePort,
  ) {}

  /** Crée un contrôle pour un véhicule. */
  start(vehicleId: string): Promise<Inspection> {
    return this.api.createInspection({ vehicleId });
  }

  /**
   * Réalise une mesure via l'appareil puis la rattache au contrôle.
   * Flux : ScandiagDevicePort → mesure → FacomApiPort.
   */
  async measure(
    inspectionId: string,
    request: MeasurementRequest,
  ): Promise<Inspection> {
    const measurement = await this.device.startMeasurement(request);
    return this.api.addMeasurement(inspectionId, measurement);
  }

  /** Clôture le contrôle. */
  complete(inspectionId: string): Promise<Inspection> {
    return this.api.completeInspection(inspectionId);
  }
}
