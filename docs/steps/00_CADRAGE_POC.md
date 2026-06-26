# Étape 00 — Cadrage du POC

## Objectif

Figer le périmètre de la phase 0 et organiser la documentation de référence.

## Travaux

- Centraliser la documentation dans `docs/`.
- Décrire les étapes dans `docs/steps/`.
- Rappeler la règle fondamentale : aucune communication Bluetooth réelle.

## Décisions

- Le SCANDIAG réel est remplacé par `MockScandiagAdapter`.
- L'API FACOM réelle est remplacée par une API NestJS simulée.
- Tout passe par les ports `FacomApiPort` et `ScandiagDevicePort`.

## Critères de sortie

- [x] Périmètre validé et documenté.
- [x] Liste ordonnée des étapes disponible.
- [x] Règles de développement rappelées (`AGENTS.MD`).
