import { Injectable } from '@angular/core';
import { type Inspection, InspectionSchema } from '@scandiag/contracts';
import { z } from 'zod';

const STORAGE_KEY = 'scandiag.inspections';
const InspectionsSchema = z.array(InspectionSchema);

/**
 * Historique des contrôles persisté localement (localStorage). Survit aux
 * rechargements et ne dépend pas de la mémoire de l'API simulée.
 */
@Injectable({ providedIn: 'root' })
export class InspectionHistoryStore {
  /** Contrôles d'un véhicule, du plus récent au plus ancien. */
  listByVehicle(vehicleId: string): Inspection[] {
    return this.readAll()
      .filter((inspection) => inspection.vehicleId === vehicleId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /** Insère ou met à jour un contrôle (clé : identifiant). */
  save(inspection: Inspection): void {
    const all = this.readAll().filter((item) => item.id !== inspection.id);
    all.push(inspection);
    this.writeAll(all);
  }

  private readAll(): Inspection[] {
    if (typeof localStorage === 'undefined') {
      return [];
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    try {
      const parsed = InspectionsSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : [];
    } catch {
      return [];
    }
  }

  private writeAll(inspections: Inspection[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inspections));
  }
}
