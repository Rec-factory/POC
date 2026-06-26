import type {
  MeasurementQuality,
  MeasurementStatus,
  MeasurementType,
  ScandiagMeasurement,
  WheelPosition,
} from '@scandiag/contracts';

/**
 * Bornes d'évaluation par type de mesure (valeurs en millimètres).
 * Ces seuils sont volontairement simplifiés pour la démonstration et
 * ne constituent pas un diagnostic certifié.
 */
export interface MeasurementBand {
  /** Limite en dessous de laquelle la mesure est critique. */
  threshold: number;
  /** Seuil en dessous duquel la mesure est à surveiller. */
  warningBelow: number;
}

export const MEASUREMENT_BANDS: Record<MeasurementType, MeasurementBand> = {
  // Profondeur de sculpture d'un pneu : limite légale 1,6 mm.
  tire: { threshold: 1.6, warningBelow: 3.0 },
  // Épaisseur d'un disque de frein : limite d'usure simulée.
  'brake-disc': { threshold: 20.0, warningBelow: 22.0 },
};

/**
 * Déduit le statut métier d'une mesure à partir de sa valeur et de sa
 * qualité technique. Une qualité `invalid` rend la mesure invalide.
 */
export function evaluateMeasurement(
  type: MeasurementType,
  value: number,
  quality: MeasurementQuality,
): { status: MeasurementStatus; threshold: number } {
  const band = MEASUREMENT_BANDS[type];
  if (quality === 'invalid' || Number.isNaN(value)) {
    return { status: 'invalid', threshold: band.threshold };
  }
  if (value < band.threshold) {
    return { status: 'critical', threshold: band.threshold };
  }
  if (value < band.warningBelow) {
    return { status: 'warning', threshold: band.threshold };
  }
  return { status: 'good', threshold: band.threshold };
}

/** Paramètres de construction d'une mesure simulée. */
export interface BuildMeasurementInput {
  id: string;
  type: MeasurementType;
  position: WheelPosition;
  value: number;
  quality: MeasurementQuality;
  measuredAt: string;
}

/**
 * Construit une mesure complète et cohérente à partir d'une valeur
 * brute simulée. Le statut et le seuil sont calculés par le domaine.
 */
export function buildMeasurement(
  input: BuildMeasurementInput,
): ScandiagMeasurement {
  const { status, threshold } = evaluateMeasurement(
    input.type,
    input.value,
    input.quality,
  );
  return {
    id: input.id,
    type: input.type,
    position: input.position,
    value: input.value,
    unit: 'mm',
    threshold,
    status,
    quality: input.quality,
    measuredAt: input.measuredAt,
    source: 'simulation',
  };
}
