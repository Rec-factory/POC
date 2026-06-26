import type {
  DemoScenarioId,
  MeasurementQuality,
  MeasurementRequest,
  ScandiagDevice,
} from '@scandiag/contracts';
import { DEFAULT_DEVICES } from './devices';
import { nominalValue } from './nominal-values';

/** Catégorie d'un scénario, pour le regroupement dans l'IHM. */
export type ScenarioCategory = 'connexion' | 'mesure' | 'api';

/** Résolution de la valeur produite par une mesure simulée. */
export type MeasurementOutcome =
  | { readonly kind: 'nominal' }
  | {
      readonly kind: 'fixed';
      readonly value: number;
      readonly quality: MeasurementQuality;
    };

/** Comportement simulé de l'appareil pour un scénario. */
export interface DeviceBehavior {
  readonly available: boolean;
  readonly devices: readonly ScandiagDevice[];
  readonly canConnect: boolean;
  readonly batteryLevel: number | null;
  /** Provoque une déconnexion pendant la mesure. */
  readonly dropDuringMeasurement: boolean;
  readonly measurement: MeasurementOutcome;
}

/** Définition complète et déterministe d'un scénario de démonstration. */
export interface DemoScenario {
  readonly id: DemoScenarioId;
  readonly label: string;
  readonly description: string;
  readonly category: ScenarioCategory;
  readonly device: DeviceBehavior;
}

const NOMINAL_DEVICE: DeviceBehavior = {
  available: true,
  devices: DEFAULT_DEVICES,
  canConnect: true,
  batteryLevel: 87,
  dropDuringMeasurement: false,
  measurement: { kind: 'nominal' },
};

function withMeasurement(outcome: MeasurementOutcome): DeviceBehavior {
  return { ...NOMINAL_DEVICE, measurement: outcome };
}

/** Catalogue déterministe des scénarios de démonstration. */
export const DEMO_SCENARIOS: Readonly<Record<DemoScenarioId, DemoScenario>> = {
  nominal: {
    id: 'nominal',
    label: 'Parcours nominal',
    description: 'Connexion et mesures conformes.',
    category: 'connexion',
    device: NOMINAL_DEVICE,
  },
  'no-device': {
    id: 'no-device',
    label: 'Aucun appareil trouvé',
    description: 'La recherche ne retourne aucun SCANDIAG.',
    category: 'connexion',
    device: {
      ...NOMINAL_DEVICE,
      available: true,
      devices: [],
    },
  },
  'connection-failed': {
    id: 'connection-failed',
    label: 'Connexion impossible',
    description: 'Un appareil est trouvé mais la connexion échoue.',
    category: 'connexion',
    device: { ...NOMINAL_DEVICE, canConnect: false },
  },
  'low-battery': {
    id: 'low-battery',
    label: 'Batterie faible',
    description: "L'appareil se connecte avec une batterie faible.",
    category: 'connexion',
    device: { ...NOMINAL_DEVICE, batteryLevel: 8 },
  },
  'disconnect-during-measurement': {
    id: 'disconnect-during-measurement',
    label: 'Déconnexion pendant la mesure',
    description: 'La liaison est perdue au cours de la mesure.',
    category: 'connexion',
    device: { ...NOMINAL_DEVICE, dropDuringMeasurement: true },
  },
  'measurement-good': {
    id: 'measurement-good',
    label: 'Mesure correcte',
    description: 'La mesure est nettement au-dessus du seuil.',
    category: 'mesure',
    device: withMeasurement({ kind: 'fixed', value: 6.5, quality: 'good' }),
  },
  'measurement-warning': {
    id: 'measurement-warning',
    label: 'Mesure à surveiller',
    description: 'La mesure est proche du seuil.',
    category: 'mesure',
    device: withMeasurement({ kind: 'fixed', value: 2.3, quality: 'good' }),
  },
  'measurement-critical': {
    id: 'measurement-critical',
    label: 'Mesure critique',
    description: 'La mesure est sous le seuil réglementaire.',
    category: 'mesure',
    device: withMeasurement({ kind: 'fixed', value: 1.1, quality: 'good' }),
  },
  'measurement-invalid': {
    id: 'measurement-invalid',
    label: 'Mesure invalide',
    description: 'Le relevé est instable et non exploitable.',
    category: 'mesure',
    device: withMeasurement({
      kind: 'fixed',
      value: 0,
      quality: 'invalid',
    }),
  },
  'api-slow': {
    id: 'api-slow',
    label: 'API lente',
    description: "L'API simulée répond avec une latence importante.",
    category: 'api',
    device: NOMINAL_DEVICE,
  },
  'api-unavailable': {
    id: 'api-unavailable',
    label: 'API indisponible',
    description: "L'API simulée renvoie une erreur 503.",
    category: 'api',
    device: NOMINAL_DEVICE,
  },
  'save-rejected': {
    id: 'save-rejected',
    label: 'Sauvegarde refusée',
    description: "L'enregistrement d'une mesure est refusé (422).",
    category: 'api',
    device: NOMINAL_DEVICE,
  },
};

/** Renvoie la définition d'un scénario. */
export function getScenario(id: DemoScenarioId): DemoScenario {
  return DEMO_SCENARIOS[id];
}

/** Liste ordonnée des scénarios pour l'affichage. */
export const DEMO_SCENARIO_LIST: readonly DemoScenario[] =
  Object.values(DEMO_SCENARIOS);

/**
 * Résout la valeur et la qualité d'une mesure pour un scénario donné,
 * de façon déterministe.
 */
export function resolveMeasurement(
  scenario: DemoScenario,
  request: MeasurementRequest,
): { value: number; quality: MeasurementQuality } {
  const outcome = scenario.device.measurement;
  if (outcome.kind === 'fixed') {
    return { value: outcome.value, quality: outcome.quality };
  }
  return {
    value: nominalValue(request.type, request.position),
    quality: 'good',
  };
}
