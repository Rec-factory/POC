import { Injectable } from '@nestjs/common';
import type {
  CreateInspectionRequest,
  Inspection,
  ScandiagMeasurement,
} from '@scandiag/contracts';
import { InspectionStore } from '../data/inspection-store.service';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class InspectionsService {
  constructor(
    private readonly store: InspectionStore,
    private readonly vehiclesService: VehiclesService,
  ) {}

  create(input: CreateInspectionRequest, technicianId: string): Inspection {
    this.vehiclesService.getOrThrow(input.vehicleId);
    return this.store.create(input.vehicleId, technicianId);
  }

  addMeasurement(
    inspectionId: string,
    measurement: ScandiagMeasurement,
  ): Inspection {
    return this.store.addMeasurement(inspectionId, measurement);
  }

  complete(inspectionId: string): Inspection {
    return this.store.complete(inspectionId);
  }
}
