import type {
  MeasurementStatus,
  MeasurementType,
  WheelPosition,
} from '@scandiag/contracts';

/** Libellé lisible d'un statut de mesure. */
export function statusLabel(status: MeasurementStatus): string {
  switch (status) {
    case 'good':
      return 'Conforme';
    case 'warning':
      return 'À surveiller';
    case 'critical':
      return 'Critique';
    case 'invalid':
      return 'Invalide';
  }
}

/** Couleur Ionic associée à un statut. */
export function statusColor(status: MeasurementStatus): string {
  switch (status) {
    case 'good':
      return 'success';
    case 'warning':
      return 'warning';
    case 'critical':
      return 'danger';
    case 'invalid':
      return 'medium';
  }
}

/** Classe CSS de pastille associée à un statut. */
export function statusPillClass(status: MeasurementStatus): string {
  return `status-pill status-pill--${status}`;
}

/** Libellé d'un type de mesure. */
export function measurementTypeLabel(type: MeasurementType): string {
  return type === 'tire' ? 'Pneu' : 'Disque de frein';
}

/** Libellé d'une position de roue. */
export function positionLabel(position: WheelPosition): string {
  switch (position) {
    case 'front-left':
      return 'Avant gauche';
    case 'front-right':
      return 'Avant droit';
    case 'rear-left':
      return 'Arrière gauche';
    case 'rear-right':
      return 'Arrière droit';
  }
}

/** Positions de roue ordonnées pour l'affichage. */
export const WHEEL_POSITIONS: readonly WheelPosition[] = [
  'front-left',
  'front-right',
  'rear-left',
  'rear-right',
];
