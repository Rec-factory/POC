import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DEMO_SCENARIOS } from '@scandiag/test-fixtures';
import { DemoModeStore } from './core/state/demo-mode.store';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <div class="simulation-banner" role="status" aria-live="polite">
        Mode simulation — {{ bannerLabel() }}
      </div>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent {
  private readonly demoMode = inject(DemoModeStore);

  readonly bannerLabel = computed(() => {
    const scenario = this.demoMode.scenario();
    return scenario === 'nominal'
      ? 'aucune mesure réelle'
      : `scénario : ${DEMO_SCENARIOS[scenario].label}`;
  });
}
