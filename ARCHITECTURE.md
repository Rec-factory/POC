# Architecture du POC

## Vue d'ensemble

```text
Application Ionic Angular
        |
        +-- HttpFacomApiAdapter ------> API NestJS simulée
        |
        +-- MockScandiagAdapter ------> moteur de scénarios
        |
        +-- Stores Signals
        |
        +-- Pages Ionic
```

## Dépendances

Les pages dépendent des cas d'usage.

Les cas d'usage dépendent des ports.

Les adaptateurs implémentent les ports.

Le domaine ne dépend ni d'Ionic, ni de NestJS, ni de Capacitor.

## Flux d'une mesure

```text
Page de mesure
→ cas d'usage StartMeasurement
→ ScandiagDevicePort
→ MockScandiagAdapter
→ DemoScenario
→ ScandiagMeasurement
→ InspectionStore
→ FacomApiPort
→ API NestJS
```

## Préparation de la phase suivante

L'architecture autorise ultérieurement l'ajout de :

- `CapacitorBleScandiagAdapter` ;
- `CapacitorClassicScandiagAdapter`.

Ces adaptateurs ne doivent pas être développés pendant la phase 0.
