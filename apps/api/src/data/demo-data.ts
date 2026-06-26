import type { User, Vehicle } from '@scandiag/contracts';

/** Compte de démonstration avec mot de passe fictif (non sensible). */
export interface DemoAccount {
  user: User;
  password: string;
}

/**
 * Comptes de démonstration. Aucun mot de passe réel, aucune donnée
 * personnelle. Utilisés uniquement pour la phase 0.
 */
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    password: 'demo',
    user: {
      id: 'user-demo',
      email: 'demo@facom.test',
      displayName: 'Compte démonstration',
      role: 'demo',
    },
  },
  {
    password: 'scandiag',
    user: {
      id: 'user-tech',
      email: 'tech@facom.test',
      displayName: 'Technicien démonstration',
      role: 'technician',
    },
  },
];

/** Véhicules fictifs avec plaques d'immatriculation fictives. */
export const DEMO_VEHICLES: readonly Vehicle[] = [
  {
    id: 'veh-001',
    licensePlate: 'AA-001-BB',
    make: 'Renault',
    model: 'Clio',
    year: 2019,
    vin: 'VF1DEMO0000000001',
    mileageKm: 84200,
  },
  {
    id: 'veh-002',
    licensePlate: 'CC-022-DD',
    make: 'Peugeot',
    model: '308',
    year: 2021,
    vin: 'VF3DEMO0000000002',
    mileageKm: 41250,
  },
  {
    id: 'veh-003',
    licensePlate: 'EE-333-FF',
    make: 'Citroën',
    model: 'Berlingo',
    year: 2017,
    vin: 'VF7DEMO0000000003',
    mileageKm: 132980,
  },
];
