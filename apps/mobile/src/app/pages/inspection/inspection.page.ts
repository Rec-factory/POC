import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import type {
  MeasurementType,
  ScandiagMeasurement,
  WheelPosition,
} from '@scandiag/contracts';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  batteryDeadOutline,
  batteryHalfOutline,
  bluetoothOutline,
  checkmarkDoneOutline,
} from 'ionicons/icons';
import { InspectionFacade } from '../../core/inspection/inspection.facade';
import { ScandiagDeviceError } from '../../core/device/mock-scandiag.adapter';
import { FacomApiError } from '../../core/api/facom-api.error';
import {
  WHEEL_POSITIONS,
  measurementTypeLabel,
  positionLabel,
  statusLabel,
  statusPillClass,
} from '../../shared/measurement-presentation';

@Component({
  selector: 'app-inspection',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonBadge,
    IonSpinner,
    IonText,
  ],
  templateUrl: './inspection.page.html',
})
export class InspectionPage implements OnInit {
  private readonly facade = inject(InspectionFacade);
  private readonly router = inject(Router);

  /** Identifiant du véhicule injecté depuis la route. */
  readonly vehicleId = input.required<string>();

  readonly deviceState = this.facade.deviceState;
  readonly isConnected = this.facade.isConnected;
  readonly inspection = this.facade.inspection;

  readonly selectedType = signal<MeasurementType>('tire');
  readonly busyPosition = signal<WheelPosition | null>(null);
  readonly connecting = signal(false);
  readonly completing = signal(false);
  readonly error = signal<string | null>(null);

  readonly positions = WHEEL_POSITIONS;
  readonly statusLabel = statusLabel;
  readonly statusPillClass = statusPillClass;
  readonly positionLabel = positionLabel;
  readonly typeLabel = measurementTypeLabel;

  /** Mesures du contrôle indexées par type+position. */
  private readonly measurementIndex = computed(() => {
    const map = new Map<string, ScandiagMeasurement>();
    for (const measurement of this.inspection()?.measurements ?? []) {
      map.set(`${measurement.type}:${measurement.position}`, measurement);
    }
    return map;
  });

  constructor() {
    addIcons({
      bluetoothOutline,
      batteryHalfOutline,
      batteryDeadOutline,
      checkmarkDoneOutline,
    });
  }

  ngOnInit(): void {
    if (this.inspection()?.vehicleId !== this.vehicleId()) {
      this.facade.reset();
    }
    if (!this.inspection()) {
      void this.startInspection();
    }
  }

  measurementFor(position: WheelPosition): ScandiagMeasurement | undefined {
    return this.measurementIndex().get(`${this.selectedType()}:${position}`);
  }

  onTypeChange(value: string | number | undefined): void {
    if (value === 'tire' || value === 'brake-disc') {
      this.selectedType.set(value);
    }
  }

  connectionLabel(): string {
    switch (this.deviceState().connection) {
      case 'idle':
        return 'Prêt à rechercher';
      case 'searching':
        return 'Recherche en cours…';
      case 'device-found':
        return 'Appareil détecté';
      case 'connecting':
        return 'Connexion…';
      case 'connected':
        return 'Connecté';
      case 'measuring':
        return 'Mesure en cours…';
      case 'disconnecting':
        return 'Déconnexion…';
      case 'disconnected':
        return 'Déconnecté';
      case 'error':
        return 'Erreur';
    }
  }

  async connect(): Promise<void> {
    this.connecting.set(true);
    this.error.set(null);
    try {
      await this.facade.connect();
    } catch (caught) {
      this.error.set(this.toMessage(caught));
    } finally {
      this.connecting.set(false);
    }
  }

  async measure(position: WheelPosition): Promise<void> {
    if (this.busyPosition()) {
      return;
    }
    this.busyPosition.set(position);
    this.error.set(null);
    try {
      await this.facade.measure({ type: this.selectedType(), position });
    } catch (caught) {
      this.error.set(this.toMessage(caught));
    } finally {
      this.busyPosition.set(null);
    }
  }

  async complete(): Promise<void> {
    this.completing.set(true);
    this.error.set(null);
    try {
      await this.facade.complete();
      await this.router.navigateByUrl(`/vehicles/${this.vehicleId()}`);
    } catch (caught) {
      this.error.set(this.toMessage(caught));
    } finally {
      this.completing.set(false);
    }
  }

  private async startInspection(): Promise<void> {
    this.error.set(null);
    try {
      await this.facade.start(this.vehicleId());
    } catch (caught) {
      this.error.set(this.toMessage(caught));
    }
  }

  private toMessage(caught: unknown): string {
    if (
      caught instanceof FacomApiError ||
      caught instanceof ScandiagDeviceError
    ) {
      return caught.message;
    }
    return 'Une erreur est survenue.';
  }
}
