import { Injectable } from '@nestjs/common';
import type { Inspection, Vehicle } from '@scandiag/contracts';
import { ApiException } from '../common/api-exception';
import { DEMO_VEHICLES } from '../data/demo-data';
import { InspectionStore } from '../data/inspection-store.service';

@Injectable()
export class VehiclesService {
  constructor(private readonly store: InspectionStore) {}

  list(): Vehicle[] {
    return [...DEMO_VEHICLES];
  }

  getOrThrow(vehicleId: string): Vehicle {
    const vehicle = DEMO_VEHICLES.find((item) => item.id === vehicleId);
    if (!vehicle) {
      throw ApiException.notFound(`Véhicule introuvable : ${vehicleId}.`);
    }
    return vehicle;
  }

  listInspections(vehicleId: string): Inspection[] {
    this.getOrThrow(vehicleId);
    return this.store.listByVehicle(vehicleId);
  }
}
