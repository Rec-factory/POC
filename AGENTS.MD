# AGENTS.MD — FACOM SCANDIAG Mobile POC

## 1. Mission

Développer un POC mobile démontrant une nouvelle expérience numérique autour du FACOM SCANDIAG.

Le POC doit fonctionner sans appareil physique. Toutes les interactions matérielles sont simulées.

Le résultat attendu est une application Ionic Angular exécutable :

- dans un navigateur ;
- sous forme de PWA si nécessaire ;
- dans une application Android Capacitor.

## 2. Règle fondamentale

Ne jamais intégrer de communication Bluetooth réelle dans cette phase.

Ne pas utiliser :

- `navigator.bluetooth` ;
- un plugin BLE ;
- un plugin Bluetooth Classic ;
- du code Kotlin de communication matérielle ;
- du code Swift ;
- des appels au SCANDIAG réel.

Toute interaction avec l'appareil passe par `ScandiagDevicePort`.

## 3. Stack obligatoire

### Application mobile

- Ionic Angular ;
- composants Angular standalone ;
- TypeScript strict ;
- Angular Signals pour l'état local et métier ;
- RxJS pour les opérations asynchrones ;
- Capacitor pour le packaging Android.

### API

- NestJS ;
- validation Zod ;
- endpoints REST ;
- données simulées ;
- erreurs HTTP explicites.

### Qualité

- ESLint ;
- Prettier ;
- Vitest ;
- Playwright ;
- tests des cas nominaux et erreurs principales.

## 4. Architecture du dépôt

```text
apps/
  mobile/
  api/

packages/
  contracts/
  scandiag-core/
  test-fixtures/

docs/
  steps/
```

Ne pas déplacer les responsabilités sans raison documentée.

## 5. Ports et adaptateurs

Les pages Ionic ne doivent pas dépendre directement de l'implémentation du simulateur.

Utiliser les ports suivants :

```ts
export interface FacomApiPort {
  login(credentials: LoginRequest): Promise<AuthSession>;
  getCurrentUser(): Promise<User>;
  listVehicles(): Promise<Vehicle[]>;
  getVehicle(vehicleId: string): Promise<Vehicle>;
  listVehicleInspections(vehicleId: string): Promise<Inspection[]>;
  createInspection(input: CreateInspectionRequest): Promise<Inspection>;
  addMeasurement(
    inspectionId: string,
    measurement: ScandiagMeasurement,
  ): Promise<Inspection>;
  completeInspection(inspectionId: string): Promise<Inspection>;
}
```

```ts
export interface ScandiagDevicePort {
  isAvailable(): Promise<boolean>;
  searchDevices(): Promise<ScandiagDevice[]>;
  connect(deviceId: string): Promise<void>;
  disconnect(): Promise<void>;
  getState(): DeviceState;
  getBatteryLevel(): Promise<number | null>;
  startMeasurement(
    request: MeasurementRequest,
  ): Promise<ScandiagMeasurement>;
}
```

Implémentations autorisées pendant la phase 0 :

- `HttpFacomApiAdapter` ;
- `MockScandiagAdapter`.

## 6. État de l'appareil

Utiliser un état explicite :

```ts
export type DeviceConnectionState =
  | 'idle'
  | 'searching'
  | 'device-found'
  | 'connecting'
  | 'connected'
  | 'measuring'
  | 'disconnecting'
  | 'disconnected'
  | 'error';
```

Ne pas représenter l'état avec plusieurs booléens indépendants.

## 7. Modèle de mesure

Toutes les mesures utilisent le même format :

```ts
export type ScandiagMeasurement = {
  id: string;
  type: 'tire' | 'brake-disc';
  position:
    | 'front-left'
    | 'front-right'
    | 'rear-left'
    | 'rear-right';
  value: number;
  unit: 'mm';
  threshold: number;
  status: 'good' | 'warning' | 'critical' | 'invalid';
  quality: 'good' | 'unstable' | 'invalid';
  measuredAt: string;
  source: 'simulation';
};
```

Le champ `source` vaut toujours `simulation` en phase 0.

## 8. Mode démonstration

Le mode démonstration doit être déterministe.

Un même scénario doit toujours produire le même résultat.

Scénarios minimum :

- nominal ;
- aucun appareil trouvé ;
- connexion impossible ;
- batterie faible ;
- déconnexion pendant la mesure ;
- mesure correcte ;
- mesure à surveiller ;
- mesure critique ;
- mesure invalide ;
- API lente ;
- API indisponible ;
- sauvegarde refusée.

Les scénarios sont définis dans `packages/test-fixtures`.

## 9. Règles Angular

- utiliser `ChangeDetectionStrategy.OnPush` ;
- préférer les Signals pour l'état ;
- ne pas appeler l'API dans les composants de présentation ;
- séparer pages, composants et services ;
- ne pas utiliser NgRx dans ce POC ;
- ne pas utiliser `any` ;
- ne pas ignorer les erreurs TypeScript ;
- ne pas dupliquer les types entre le front et l'API ;
- déduire les types depuis les schémas Zod lorsque possible.

## 10. Règles Ionic

- concevoir mobile-first ;
- viser d'abord un écran de 360 px de largeur ;
- respecter les zones sûres ;
- utiliser des cibles tactiles suffisamment grandes ;
- éviter les tableaux complexes sur mobile ;
- fournir un retour visuel pour les actions longues ;
- afficher clairement le mode simulation ;
- ne jamais présenter une donnée simulée comme une mesure réelle.

## 11. Règles NestJS

- tous les endpoints sont préfixés par `/api` ;
- utiliser des contrôleurs minces ;
- placer la logique dans les services ;
- valider les entrées avec les schémas partagés ;
- retourner des erreurs structurées ;
- documenter les endpoints ;
- injecter des délais et erreurs seulement via le moteur de scénario.

Format d'erreur recommandé :

```json
{
  "statusCode": 503,
  "code": "API_UNAVAILABLE",
  "message": "Le service FACOM simulé est indisponible.",
  "details": null
}
```

## 12. Sécurité du POC

- ne pas stocker de mot de passe réel ;
- utiliser uniquement des comptes de démonstration ;
- ne pas inclure de secrets dans le dépôt ;
- ne pas utiliser de données personnelles réelles ;
- utiliser des plaques d'immatriculation fictives ;
- ne pas prétendre fournir un diagnostic certifié.

## 13. Tests obligatoires

Avant de considérer une étape terminée :

- les tests unitaires concernés passent ;
- les tests de composants concernés passent ;
- le parcours Playwright concerné passe ;
- le build Angular passe ;
- le build NestJS passe ;
- aucun lint bloquant n'est présent.

Tests fonctionnels minimum :

1. connexion ;
2. sélection d'un véhicule ;
3. connexion au SCANDIAG simulé ;
4. mesure d'un pneu ;
5. mesure d'un disque ;
6. synthèse ;
7. sauvegarde ;
8. historique ;
9. erreur de connexion ;
10. erreur API.

## 14. Documentation

Après chaque étape :

- mettre à jour le fichier d'étape ;
- cocher les critères terminés ;
- documenter les décisions importantes ;
- ajouter les commandes utiles ;
- signaler clairement les écarts au plan.

## 15. Définition globale de terminé

Le POC est terminé lorsque :

- il fonctionne dans un navigateur mobile ;
- il peut être généré en application Android Capacitor ;
- l'API simulée est autonome ;
- tous les parcours utilisent des données simulées ;
- le mode démonstration permet de choisir les scénarios ;
- le parcours nominal est entièrement testable ;
- les erreurs principales sont démontrables ;
- la documentation permet à une autre équipe de reprendre le projet.
