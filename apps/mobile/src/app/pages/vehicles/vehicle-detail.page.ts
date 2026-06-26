import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import type { Inspection, Vehicle } from '@scandiag/contracts';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { VehiclesFacade } from '../../core/vehicles/vehicles.facade';
import { FacomApiError } from '../../core/api/facom-api.error';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonNote,
    IonSpinner,
    IonText,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/vehicles"></ion-back-button>
        </ion-buttons>
        <ion-title>Véhicule</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      @if (loading()) {
        <div class="ion-text-center ion-padding">
          <ion-spinner></ion-spinner>
        </div>
      } @else {
        @if (error(); as message) {
          <ion-text color="danger"
            ><p>{{ message }}</p></ion-text
          >
        } @else if (vehicle()) {
          <h1>{{ vehicle()!.make }} {{ vehicle()!.model }}</h1>
          <ion-list inset="true">
            <ion-item>
              <ion-label>
                Immatriculation
                <ion-note>{{ vehicle()!.licensePlate }}</ion-note>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                Année <ion-note>{{ vehicle()!.year }}</ion-note>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                Kilométrage <ion-note>{{ vehicle()!.mileageKm }} km</ion-note>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label
                >VIN <ion-note>{{ vehicle()!.vin }}</ion-note></ion-label
              >
            </ion-item>
          </ion-list>

          <ion-list inset="true">
            <ion-list-header>Historique des contrôles</ion-list-header>
            @if (inspections().length === 0) {
              <ion-item>
                <ion-label>
                  <ion-note>Aucun contrôle enregistré.</ion-note>
                </ion-label>
              </ion-item>
            } @else {
              @for (inspection of inspections(); track inspection.id) {
                <ion-item>
                  <ion-label>
                    {{ inspection.createdAt | date: 'short' }}
                    <ion-note>
                      {{ inspection.measurements.length }} mesure(s) ·
                      {{
                        inspection.status === 'completed'
                          ? 'Clôturé'
                          : 'En cours'
                      }}
                    </ion-note>
                  </ion-label>
                </ion-item>
              }
            }
          </ion-list>
        }
      }
    </ion-content>
  `,
})
export class VehicleDetailPage implements OnInit {
  private readonly vehiclesFacade = inject(VehiclesFacade);

  /** Identifiant du véhicule injecté depuis la route (withComponentInputBinding). */
  readonly id = input.required<string>();

  readonly vehicle = signal<Vehicle | null>(null);
  readonly inspections = signal<Inspection[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    void this.load();
  }

  private async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const vehicleId = this.id();
      const [vehicle, inspections] = await Promise.all([
        this.vehiclesFacade.getVehicle(vehicleId),
        this.vehiclesFacade.listInspections(vehicleId),
      ]);
      this.vehicle.set(vehicle);
      this.inspections.set(inspections);
    } catch (caught) {
      this.error.set(
        caught instanceof FacomApiError
          ? caught.message
          : 'Chargement impossible.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
