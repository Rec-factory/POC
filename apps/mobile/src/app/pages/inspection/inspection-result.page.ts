import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { Router } from '@angular/router';
import type { MeasurementStatus } from '@scandiag/contracts';
import { summarizeInspection } from '@scandiag/core';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { InspectionFacade } from '../../core/inspection/inspection.facade';
import {
  measurementTypeLabel,
  positionLabel,
  statusColor,
  statusLabel,
  statusPillClass,
} from '../../shared/measurement-presentation';

@Component({
  selector: 'app-inspection-result',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonNote,
    IonBadge,
    IonButton,
    IonText,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Résultat du contrôle</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      @if (inspection(); as insp) {
        <h1>
          {{ verdictLabel() }}
          <ion-badge [color]="verdictColor()">{{ verdictBadge() }}</ion-badge>
        </h1>
        <p>
          <ion-note>
            {{ summary().total }} mesure(s) —
            {{ summary().countByStatus.good }} conforme(s),
            {{ summary().countByStatus.warning }} à surveiller,
            {{ summary().countByStatus.critical }} critique(s),
            {{ summary().countByStatus.invalid }} invalide(s).
          </ion-note>
        </p>

        <ion-list inset="true">
          <ion-list-header>Détail des mesures</ion-list-header>
          @for (m of insp.measurements; track m.id) {
            <ion-item>
              <ion-label>
                {{ typeLabel(m.type) }} — {{ positionLabel(m.position) }}
                <ion-note>
                  {{ m.value }} {{ m.unit }} (seuil {{ m.threshold }}
                  {{ m.unit }})
                </ion-note>
              </ion-label>
              <span slot="end" [class]="statusPillClass(m.status)">
                {{ statusLabel(m.status) }}
              </span>
            </ion-item>
          }
        </ion-list>

        <p class="ion-text-center">
          <ion-note>
            Démonstration — ces mesures simulées ne constituent pas un
            diagnostic certifié.
          </ion-note>
        </p>

        <ion-button
          expand="block"
          (click)="backToVehicle()"
          data-testid="result-done"
        >
          Retour au véhicule
        </ion-button>
      } @else {
        <ion-text>
          <p>Aucun contrôle à afficher.</p>
        </ion-text>
        <ion-button expand="block" (click)="backToVehicle()">
          Retour au véhicule
        </ion-button>
      }
    </ion-content>
  `,
})
export class InspectionResultPage {
  private readonly facade = inject(InspectionFacade);
  private readonly router = inject(Router);

  readonly vehicleId = input.required<string>();

  readonly inspection = this.facade.inspection;
  readonly summary = computed(() => {
    const insp = this.inspection();
    return insp
      ? summarizeInspection(insp)
      : {
          total: 0,
          countByStatus: { good: 0, warning: 0, critical: 0, invalid: 0 },
          worstStatus: null,
          hasInvalidMeasurements: false,
        };
  });

  readonly typeLabel = measurementTypeLabel;
  readonly positionLabel = positionLabel;
  readonly statusLabel = statusLabel;
  readonly statusPillClass = statusPillClass;

  verdictBadge(): string {
    const worst = this.summary().worstStatus;
    return worst ? statusLabel(worst) : '—';
  }

  verdictColor(): string {
    const worst = this.summary().worstStatus;
    return worst ? statusColor(worst) : 'medium';
  }

  verdictLabel(): string {
    const worst: MeasurementStatus | null = this.summary().worstStatus;
    switch (worst) {
      case 'good':
        return 'Contrôle conforme';
      case 'warning':
        return 'Points à surveiller';
      case 'critical':
        return 'Anomalie critique';
      case 'invalid':
        return 'Mesures à refaire';
      default:
        return 'Contrôle sans mesure';
    }
  }

  async backToVehicle(): Promise<void> {
    await this.router.navigateByUrl(`/vehicles/${this.vehicleId()}`);
    this.facade.reset();
  }
}
