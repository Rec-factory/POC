import type {
  Inspection,
  MeasurementStatus,
  ScandiagMeasurement,
} from '@scandiag/contracts';

/** Synthèse agrégée d'un contrôle. */
export interface InspectionSummary {
  total: number;
  countByStatus: Record<MeasurementStatus, number>;
  /** Statut le plus défavorable rencontré. */
  worstStatus: MeasurementStatus | null;
  hasInvalidMeasurements: boolean;
}

const STATUS_SEVERITY: Record<MeasurementStatus, number> = {
  good: 0,
  warning: 1,
  invalid: 2,
  critical: 3,
};

/** Calcule la synthèse d'une liste de mesures. */
export function summarizeMeasurements(
  measurements: readonly ScandiagMeasurement[],
): InspectionSummary {
  const countByStatus: Record<MeasurementStatus, number> = {
    good: 0,
    warning: 0,
    critical: 0,
    invalid: 0,
  };

  let worstStatus: MeasurementStatus | null = null;
  for (const measurement of measurements) {
    countByStatus[measurement.status] += 1;
    if (
      worstStatus === null ||
      STATUS_SEVERITY[measurement.status] > STATUS_SEVERITY[worstStatus]
    ) {
      worstStatus = measurement.status;
    }
  }

  return {
    total: measurements.length,
    countByStatus,
    worstStatus,
    hasInvalidMeasurements: countByStatus.invalid > 0,
  };
}

/** Synthèse d'un contrôle complet. */
export function summarizeInspection(inspection: Inspection): InspectionSummary {
  return summarizeMeasurements(inspection.measurements);
}
