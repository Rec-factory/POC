import { describe, expect, it } from 'vitest';
import { DEMO_SCENARIOS, getScenario, resolveMeasurement } from './scenarios';

describe('scénarios de démonstration', () => {
  it('expose les douze scénarios attendus', () => {
    expect(Object.keys(DEMO_SCENARIOS)).toHaveLength(12);
  });

  it('produit une valeur nominale déterministe', () => {
    const request = { type: 'tire', position: 'front-left' } as const;
    const first = resolveMeasurement(getScenario('nominal'), request);
    const second = resolveMeasurement(getScenario('nominal'), request);
    expect(first).toEqual(second);
    expect(first.quality).toBe('good');
  });

  it('force une valeur fixe pour un scénario de mesure critique', () => {
    const result = resolveMeasurement(getScenario('measurement-critical'), {
      type: 'tire',
      position: 'rear-right',
    });
    expect(result.value).toBe(1.1);
  });

  it('décrit une absence d’appareil', () => {
    expect(getScenario('no-device').device.devices).toHaveLength(0);
  });

  it('décrit une connexion impossible', () => {
    expect(getScenario('connection-failed').device.canConnect).toBe(false);
  });
});
