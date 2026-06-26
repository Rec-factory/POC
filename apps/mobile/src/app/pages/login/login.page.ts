import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { AuthFacade } from '../../core/auth/auth.facade';
import { FacomApiError } from '../../core/api/facom-api.error';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonNote,
    IonText,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Connexion</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <p>Utilisez un compte de démonstration pour continuer.</p>

      <ion-list inset="true">
        <ion-item>
          <ion-input
            label="Adresse e-mail"
            labelPlacement="stacked"
            type="email"
            autocomplete="off"
            [(ngModel)]="email"
            [disabled]="loading()"
            data-testid="login-email"
          ></ion-input>
        </ion-item>
        <ion-item>
          <ion-input
            label="Mot de passe"
            labelPlacement="stacked"
            type="password"
            [(ngModel)]="password"
            [disabled]="loading()"
            data-testid="login-password"
          ></ion-input>
        </ion-item>
      </ion-list>

      @if (error(); as message) {
        <ion-text color="danger">
          <p data-testid="login-error">{{ message }}</p>
        </ion-text>
      }

      <ion-button
        expand="block"
        (click)="submit()"
        [disabled]="loading()"
        data-testid="login-submit"
      >
        {{ loading() ? 'Connexion…' : 'Se connecter' }}
      </ion-button>

      <ion-note class="ion-margin-top">
        Comptes : <code>demo&#64;facom.test / demo</code> ou
        <code>tech&#64;facom.test / scandiag</code>.
      </ion-note>

      <ion-button expand="block" fill="clear" routerLink="/demo">
        Mode démonstration
      </ion-button>
    </ion-content>
  `,
})
export class LoginPage {
  private readonly authFacade = inject(AuthFacade);
  private readonly router = inject(Router);

  email = 'demo@facom.test';
  password = 'demo';

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  async submit(): Promise<void> {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.authFacade.login({
        email: this.email,
        password: this.password,
      });
      await this.router.navigateByUrl('/vehicles');
    } catch (caught) {
      this.error.set(
        caught instanceof FacomApiError
          ? caught.message
          : 'Connexion impossible.',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
