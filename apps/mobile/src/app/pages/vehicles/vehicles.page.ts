import {
  ChangeDetectionStrategy,
  Component,
  type OnInit,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { Vehicle } from '@scandiag/contracts';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronForwardOutline,
  flaskOutline,
  logOutOutline,
} from 'ionicons/icons';
import { VehiclesFacade } from '../../core/vehicles/vehicles.facade';
import { AuthFacade } from '../../core/auth/auth.facade';
import { FacomApiError } from '../../core/api/facom-api.error';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonSpinner,
    IonText,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Véhicules</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/demo" data-testid="open-demo">
            <ion-icon slot="icon-only" name="flask-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="logout()" data-testid="logout">
            <ion-icon slot="icon-only" name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      @if (loading()) {
        <div class="ion-text-center ion-padding">
          <ion-spinner></ion-spinner>
        </div>
      } @else {
        @if (error(); as message) {
          <ion-text color="danger">
            <p data-testid="vehicles-error">{{ message }}</p>
          </ion-text>
          <ion-button expand="block" fill="outline" (click)="reload()">
            Réessayer
          </ion-button>
        } @else {
          <ion-list inset="true">
            @for (vehicle of vehicles(); track vehicle.id) {
              <ion-item
                button="true"
                [routerLink]="['/vehicles', vehicle.id]"
                [attr.data-testid]="'vehicle-' + vehicle.id"
              >
                <ion-label>
                  {{ vehicle.make }} {{ vehicle.model }}
                  <ion-note>
                    {{ vehicle.licensePlate }} · {{ vehicle.year }} ·
                    {{ vehicle.mileageKm }} km
                  </ion-note>
                </ion-label>
                <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
              </ion-item>
            }
          </ion-list>
        }
      }
    </ion-content>
  `,
})
export class VehiclesPage implements OnInit {
  private readonly vehiclesFacade = inject(VehiclesFacade);
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  readonly vehicles = signal<Vehicle[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    addIcons({ chevronForwardOutline, flaskOutline, logOutOutline });
  }

  ngOnInit(): void {
    void this.reload();
  }

  async reload(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      this.vehicles.set(await this.vehiclesFacade.listVehicles());
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

  logout(): void {
    this.authFacade.logout();
    void this.router.navigateByUrl('/login');
  }
}
