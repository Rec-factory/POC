# Étape 02 — Architecture et contrats

## Objectif

Définir les contrats partagés et le domaine indépendant du framework.

## Travaux

- `packages/contracts` : schémas Zod et types inférés (auth, véhicules, inspections, mesures).
- `packages/scandiag-core` : ports (`FacomApiPort`, `ScandiagDevicePort`), états d'appareil, cas d'usage, règles d'évaluation des mesures.

## Critères de sortie

- [x] Types non dupliqués entre front et API.
- [x] Domaine sans dépendance Ionic / NestJS / Capacitor.
- [x] Cas d'usage testables unitairement.
