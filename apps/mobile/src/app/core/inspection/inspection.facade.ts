import { Injectable, computed, inject, signal } from '@angular/core';
import type {
  Inspection,
  MeasurementRequest,
  ScandiagDevice,
} from '@scandiag/contracts';
import {
  InspectionWorkflow,
  connectFirstAvailableDevice,
} from '@scandiag/core';
import { FACOM_API } from '../api/facom-api.token';
import { SCANDIAG_DEVICE } from '../device/scandiag-device.token';
import { MockScandiagAdapter } from '../device/mock-scandiag.adapter';
import { InspectionHistoryStore } from './inspection-history.store';

/**
 * Orchestration d'un contrôle côté mobile. S'appuie sur le cas d'usage
 * `InspectionWorkflow` du domaine et sur les ports d'API et d'appareil.
 */
@Injectable({ providedIn: 'root' })
export class InspectionFacade {
  private readonly api = inject(FACOM_API);
  private readonly device = inject(SCANDIAG_DEVICE);
  // Vue réactive de l'état du simulateur (détail d'implémentation encapsulé).
  private readonly deviceAdapter = inject(MockScandiagAdapter);
  private readonly history = inject(InspectionHistoryStore);

  private readonly workflow = new InspectionWorkflow(this.api, this.device);
  private readonly inspectionSignal = signal<Inspection | null>(null);

  /** État de l'appareil pour l'IHM. */
  readonly deviceState = this.deviceAdapter.state;
  /** Contrôle en cours. */
  readonly inspection = this.inspectionSignal.asReadonly();
  readonly isConnected = computed(
    () => this.deviceState().connection === 'connected',
  );

  async start(vehicleId: string): Promise<Inspection> {
    const inspection = await this.workflow.start(vehicleId);
    this.persist(inspection);
    return inspection;
  }

  /** Recherche puis connecte le premier appareil simulé disponible. */
  async connect(): Promise<ScandiagDevice> {
    const result = await connectFirstAvailableDevice(this.device);
    return result.device;
  }

  async disconnect(): Promise<void> {
    await this.device.disconnect();
  }

  async measure(request: MeasurementRequest): Promise<Inspection> {
    const inspection = this.requireInspection();
    const updated = await this.workflow.measure(inspection.id, request);
    this.persist(updated);
    return updated;
  }

  async complete(): Promise<Inspection> {
    const inspection = this.requireInspection();
    const updated = await this.workflow.complete(inspection.id);
    this.persist(updated);
    return updated;
  }

  reset(): void {
    this.inspectionSignal.set(null);
  }

  /** Met à jour le contrôle courant et l'historique persisté. */
  private persist(inspection: Inspection): void {
    this.inspectionSignal.set(inspection);
    this.history.save(inspection);
  }

  private requireInspection(): Inspection {
    const inspection = this.inspectionSignal();
    if (!inspection) {
      throw new Error('Aucun contrôle en cours.');
    }
    return inspection;
  }
}
