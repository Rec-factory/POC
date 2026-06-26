import { Injectable, inject } from '@angular/core';
import type { Inspection, Vehicle } from '@scandiag/contracts';
import { FACOM_API } from '../api/facom-api.token';

/** Accès aux véhicules et à leurs contrôles via le port d'API. */
@Injectable({ providedIn: 'root' })
export class VehiclesFacade {
  private readonly api = inject(FACOM_API);

  listVehicles(): Promise<Vehicle[]> {
    return this.api.listVehicles();
  }

  getVehicle(vehicleId: string): Promise<Vehicle> {
    return this.api.getVehicle(vehicleId);
  }

  listInspections(vehicleId: string): Promise<Inspection[]> {
    return this.api.listVehicleInspections(vehicleId);
  }
}
