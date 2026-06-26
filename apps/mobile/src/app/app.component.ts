import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <div class="simulation-banner" role="status" aria-live="polite">
        Mode simulation — aucune mesure réelle
      </div>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent {}
