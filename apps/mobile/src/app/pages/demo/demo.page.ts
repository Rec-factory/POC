import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { DemoScenarioId } from '@scandiag/contracts';
import {
  DEMO_SCENARIO_LIST,
  type ScenarioCategory,
} from '@scandiag/test-fixtures';
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
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { DemoModeStore } from '../../core/state/demo-mode.store';

interface ScenarioGroup {
  readonly category: ScenarioCategory;
  readonly title: string;
  readonly scenarios: typeof DEMO_SCENARIO_LIST;
}

const CATEGORY_TITLES: Record<ScenarioCategory, string> = {
  connexion: 'Connexion',
  mesure: 'Mesure',
  api: 'API',
};

@Component({
  selector: 'app-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
    IonRadioGroup,
    IonRadio,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/vehicles"></ion-back-button>
        </ion-buttons>
        <ion-title>Mode démonstration</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p>
        Choisissez un scénario. Chaque scénario est
        <strong>déterministe</strong> : il produit toujours le même résultat.
      </p>

      <ion-radio-group
        [value]="current()"
        (ionChange)="select($event.detail.value)"
      >
        @for (group of groups; track group.category) {
          <ion-list inset="true">
            <ion-list-header>{{ group.title }}</ion-list-header>
            @for (scenario of group.scenarios; track scenario.id) {
              <ion-item>
                <ion-radio
                  [value]="scenario.id"
                  [attr.data-testid]="'scenario-' + scenario.id"
                >
                  {{ scenario.label }}
                  <ion-note class="ion-text-wrap">
                    {{ scenario.description }}
                  </ion-note>
                </ion-radio>
              </ion-item>
            }
          </ion-list>
        }
      </ion-radio-group>
    </ion-content>
  `,
})
export class DemoPage {
  private readonly demoMode = inject(DemoModeStore);

  readonly current = this.demoMode.scenario;

  readonly groups: readonly ScenarioGroup[] = (
    ['connexion', 'mesure', 'api'] as const
  ).map((category) => ({
    category,
    title: CATEGORY_TITLES[category],
    scenarios: DEMO_SCENARIO_LIST.filter(
      (scenario) => scenario.category === category,
    ),
  }));

  select(value: DemoScenarioId): void {
    this.demoMode.setScenario(value);
  }
}
