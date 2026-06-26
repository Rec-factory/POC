import { describe, expect, it } from 'vitest';
import type { ScandiagMeasurement } from '@scandiag/contracts';
import { summarizeMeasurements } from './inspection-summary';

function measurement(
  overrides: Partial<ScandiagMeasurement>,
): ScandiagMeasurement {
  return {
    id: 'm',
    type: 'tire',
    position: 'front-left',
    value: 3,
    unit: 'mm',
    threshold: 1.6,
    status: 'good',
    quality: 'good',
    measuredAt: '2026-06-26T10:00:00.000Z',
    source: 'simulation',
    ...overrides,
  };
}

describe('summarizeMeasurements', () => {
  it('compte les mesures par statut', () => {
    const summary = summarizeMeasurements([
      measurement({ id: 'a', status: 'good' }),
      measurement({ id: 'b', status: 'warning' }),
      measurement({ id: 'c', status: 'critical' }),
    ]);
    expect(summary.total).toBe(3);
    expect(summary.countByStatus.warning).toBe(1);
  });

  it('retient le statut le plus défavorable', () => {
    const summary = summarizeMeasurements([
      measurement({ id: 'a', status: 'good' }),
      measurement({ id: 'b', status: 'critical' }),
      measurement({ id: 'c', status: 'warning' }),
    ]);
    expect(summary.worstStatus).toBe('critical');
  });

  it('signale les mesures invalides', () => {
    const summary = summarizeMeasurements([
      measurement({ id: 'a', status: 'invalid' }),
    ]);
    expect(summary.hasInvalidMeasurements).toBe(true);
  });

  it('gère une liste vide', () => {
    const summary = summarizeMeasurements([]);
    expect(summary.total).toBe(0);
    expect(summary.worstStatus).toBeNull();
  });
});
