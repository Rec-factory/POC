import { Injectable, signal } from '@angular/core';
import type { DemoScenarioId } from '@scandiag/contracts';

/**
 * Scénario de démonstration actif. Diffusé à l'API (en-tête) et au
 * simulateur d'appareil. La sélection s'effectue à l'étape 09.
 */
@Injectable({ providedIn: 'root' })
export class DemoModeStore {
  private readonly scenarioSignal = signal<DemoScenarioId>('nominal');

  readonly scenario = this.scenarioSignal.asReadonly();

  setScenario(scenario: DemoScenarioId): void {
    this.scenarioSignal.set(scenario);
  }
}
