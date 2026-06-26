import { describe, expect, it } from 'vitest';
import {
  buildMeasurement,
  evaluateMeasurement,
} from './measurement-evaluation';

describe('evaluateMeasurement', () => {
  it('classe un pneu nettement au-dessus du seuil comme conforme', () => {
    expect(evaluateMeasurement('tire', 6, 'good').status).toBe('good');
  });

  it('classe un pneu proche du seuil comme à surveiller', () => {
    expect(evaluateMeasurement('tire', 2.3, 'good').status).toBe('warning');
  });

  it('classe un pneu sous le seuil comme critique', () => {
    const result = evaluateMeasurement('tire', 1.1, 'good');
    expect(result.status).toBe('critical');
    expect(result.threshold).toBe(1.6);
  });

  it('classe une qualité invalide comme invalide', () => {
    expect(evaluateMeasurement('tire', 5, 'invalid').status).toBe('invalid');
  });

  it('applique des seuils propres au disque de frein', () => {
    expect(evaluateMeasurement('brake-disc', 25, 'good').status).toBe('good');
    expect(evaluateMeasurement('brake-disc', 19, 'good').status).toBe(
      'critical',
    );
  });
});

describe('buildMeasurement', () => {
  it('construit une mesure cohérente issue de la simulation', () => {
    const measurement = buildMeasurement({
      id: 'm1',
      type: 'tire',
      position: 'front-left',
      value: 2.3,
      quality: 'good',
      measuredAt: '2026-06-26T10:00:00.000Z',
    });
    expect(measurement).toMatchObject({
      id: 'm1',
      unit: 'mm',
      status: 'warning',
      threshold: 1.6,
      source: 'simulation',
    });
  });
});
