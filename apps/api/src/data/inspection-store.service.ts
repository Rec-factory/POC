import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { Inspection, ScandiagMeasurement } from '@scandiag/contracts';
import { ApiException } from '../common/api-exception';

/**
 * Magasin en mémoire des contrôles. Les données sont volatiles et
 * propres à l'instance : suffisant pour un POC simulé.
 */
@Injectable()
export class InspectionStore {
  private readonly inspections = new Map<string, Inspection>();

  create(vehicleId: string, technicianId: string): Inspection {
    const inspection: Inspection = {
      id: randomUUID(),
      vehicleId,
      technicianId,
      status: 'in-progress',
      measurements: [],
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    this.inspections.set(inspection.id, inspection);
    return inspection;
  }

  getOrThrow(inspectionId: string): Inspection {
    const inspection = this.inspections.get(inspectionId);
    if (!inspection) {
      throw ApiException.notFound(`Contrôle introuvable : ${inspectionId}.`);
    }
    return inspection;
  }

  listByVehicle(vehicleId: string): Inspection[] {
    return [...this.inspections.values()]
      .filter((inspection) => inspection.vehicleId === vehicleId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  addMeasurement(
    inspectionId: string,
    measurement: ScandiagMeasurement,
  ): Inspection {
    const inspection = this.getOrThrow(inspectionId);
    if (inspection.status === 'completed') {
      throw ApiException.saveRejected(
        'Le contrôle est déjà clôturé : ajout de mesure refusé.',
      );
    }
    const updated: Inspection = {
      ...inspection,
      measurements: [...inspection.measurements, measurement],
    };
    this.inspections.set(inspectionId, updated);
    return updated;
  }

  complete(inspectionId: string): Inspection {
    const inspection = this.getOrThrow(inspectionId);
    const updated: Inspection = {
      ...inspection,
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
    this.inspections.set(inspectionId, updated);
    return updated;
  }
}
