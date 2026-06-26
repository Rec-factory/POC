import type { MeasurementType, WheelPosition } from '@scandiag/contracts';

/**
 * Valeurs nominales déterministes par type et position (en mm). Un même
 * scénario produit donc toujours le même résultat.
 */
const NOMINAL_VALUES: Record<MeasurementType, Record<WheelPosition, number>> = {
  tire: {
    'front-left': 3.4,
    'front-right': 3.2,
    'rear-left': 4.1,
    'rear-right': 3.9,
  },
  'brake-disc': {
    'front-left': 24.5,
    'front-right': 24.2,
    'rear-left': 23.1,
    'rear-right': 22.8,
  },
};

/** Renvoie la valeur nominale déterministe d'une mesure. */
export function nominalValue(
  type: MeasurementType,
  position: WheelPosition,
): number {
  return NOMINAL_VALUES[type][position];
}
