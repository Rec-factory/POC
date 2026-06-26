# Étape 06 — Simulateur SCANDIAG

## Objectif

Adaptateur matériel simulé déterministe.

## Travaux

- `MockScandiagAdapter` qui implémente `ScandiagDevicePort`.
- Machine à états explicite (`DeviceConnectionState`).
- Scénarios déterministes dans `packages/test-fixtures`.

## Critères de sortie

- [x] Recherche, connexion et mesure simulées.
- [x] État de l'appareil explicite (pas de booléens multiples).
- [x] Scénarios déterministes et rejouables.
