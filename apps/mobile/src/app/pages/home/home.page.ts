import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  carSportOutline,
  flashOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonNote,
    IonButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>FACOM SCANDIAG</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>Démonstration mobile</h1>
      <p>
        Cette application illustre un parcours de contrôle pneus et disques de
        frein. Toutes les données et mesures sont
        <strong>simulées</strong>.
      </p>

      <ion-list inset="true">
        <ion-item>
          <ion-icon slot="start" name="car-sport-outline"></ion-icon>
          <ion-label>
            Véhicules de démonstration
            <ion-note>Plaques fictives uniquement</ion-note>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" name="flash-outline"></ion-icon>
          <ion-label>
            SCANDIAG simulé
            <ion-note>Aucune connexion Bluetooth réelle</ion-note>
          </ion-label>
        </ion-item>
        <ion-item>
          <ion-icon slot="start" name="shield-checkmark-outline"></ion-icon>
          <ion-label>
            Scénarios déterministes
            <ion-note>Rejouables à l'identique</ion-note>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-button expand="block" routerLink="/home">
        Commencer la démonstration
      </ion-button>
    </ion-content>
  `,
})
export class HomePage {
  constructor() {
    addIcons({
      carSportOutline,
      flashOutline,
      shieldCheckmarkOutline,
    });
  }
}
