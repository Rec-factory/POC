import { Injectable, inject } from '@angular/core';
import type { Inspection, Vehicle } from '@scandiag/contracts';
import { FACOM_API } from '../api/facom-api.token';
import { InspectionHistoryStore } from '../inspection/inspection-history.store';

/** Accès aux véhicules (API) et à leur historique de contrôles (local). */
@Injectable({ providedIn: 'root' })
export class VehiclesFacade {
  private readonly api = inject(FACOM_API);
  private readonly history = inject(InspectionHistoryStore);

  listVehicles(): Promise<Vehicle[]> {
    return this.api.listVehicles();
  }

  getVehicle(vehicleId: string): Promise<Vehicle> {
    return this.api.getVehicle(vehicleId);
  }

  /**
   * Historique des contrôles persisté localement. Indépendant de la
   * mémoire de l'API, il survit aux rechargements de l'application.
   */
  listInspections(vehicleId: string): Inspection[] {
    return this.history.listByVehicle(vehicleId);
  }
}
