import { Injectable, type Signal, inject, signal } from '@angular/core';
import type {
  DeviceState,
  MeasurementRequest,
  ScandiagDevice,
  ScandiagMeasurement,
} from '@scandiag/contracts';
import { type ScandiagDevicePort, buildMeasurement } from '@scandiag/core';
import { getScenario, resolveMeasurement } from '@scandiag/test-fixtures';
import { DemoModeStore } from '../state/demo-mode.store';

/** Erreur typée émise par le simulateur d'appareil. */
export class ScandiagDeviceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ScandiagDeviceError';
  }
}

const SEARCH_DELAY_MS = 700;
const CONNECT_DELAY_MS = 700;
const MEASURE_DELAY_MS = 1200;

const INITIAL_STATE: DeviceState = {
  connection: 'idle',
  deviceId: null,
  batteryLevel: null,
  error: null,
};

/**
 * Simulateur logiciel du SCANDIAG. Aucune communication Bluetooth réelle.
 * Le comportement est piloté par le scénario de démonstration actif et
 * reste déterministe.
 */
@Injectable({ providedIn: 'root' })
export class MockScandiagAdapter implements ScandiagDevicePort {
  private readonly demoMode = inject(DemoModeStore);
  private readonly stateSignal = signal<DeviceState>(INITIAL_STATE);

  /** État observable de l'appareil (pour l'IHM). */
  readonly state: Signal<DeviceState> = this.stateSignal.asReadonly();

  getState(): DeviceState {
    return this.stateSignal();
  }

  async isAvailable(): Promise<boolean> {
    return this.currentScenario().device.available;
  }

  async searchDevices(): Promise<ScandiagDevice[]> {
    const scenario = this.currentScenario();
    this.patch({ connection: 'searching', error: null });
    await this.delay(SEARCH_DELAY_MS);
    const devices = [...scenario.device.devices];
    this.patch({
      connection: devices.length > 0 ? 'device-found' : 'idle',
    });
    return devices;
  }

  async connect(deviceId: string): Promise<void> {
    const scenario = this.currentScenario();
    this.patch({ connection: 'connecting', deviceId, error: null });
    await this.delay(CONNECT_DELAY_MS);
    if (!scenario.device.canConnect) {
      this.patch({
        connection: 'error',
        deviceId: null,
        error: "La connexion à l'appareil a échoué.",
      });
      throw new ScandiagDeviceError("La connexion à l'appareil a échoué.");
    }
    this.patch({
      connection: 'connected',
      batteryLevel: scenario.device.batteryLevel,
    });
  }

  async disconnect(): Promise<void> {
    this.patch({ connection: 'disconnecting' });
    await this.delay(200);
    this.stateSignal.set({ ...INITIAL_STATE, connection: 'disconnected' });
  }

  async getBatteryLevel(): Promise<number | null> {
    return this.currentScenario().device.batteryLevel;
  }

  async startMeasurement(
    request: MeasurementRequest,
  ): Promise<ScandiagMeasurement> {
    const scenario = this.currentScenario();
    if (this.stateSignal().connection !== 'connected') {
      throw new ScandiagDeviceError("L'appareil n'est pas connecté.");
    }
    this.patch({ connection: 'measuring', error: null });
    await this.delay(MEASURE_DELAY_MS);

    if (scenario.device.dropDuringMeasurement) {
      this.patch({
        connection: 'error',
        deviceId: null,
        error: 'Déconnexion pendant la mesure.',
      });
      throw new ScandiagDeviceError('Déconnexion pendant la mesure.');
    }

    const { value, quality } = resolveMeasurement(scenario, request);
    const measurement = buildMeasurement({
      id: crypto.randomUUID(),
      type: request.type,
      position: request.position,
      value,
      quality,
      measuredAt: new Date().toISOString(),
    });
    this.patch({ connection: 'connected' });
    return measurement;
  }

  private currentScenario() {
    return getScenario(this.demoMode.scenario());
  }

  private patch(partial: Partial<DeviceState>): void {
    this.stateSignal.set({ ...this.stateSignal(), ...partial });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
