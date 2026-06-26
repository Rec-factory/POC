# Étape 03 — API FACOM simulée

## Objectif

Fournir une API NestJS autonome qui simule le back-office FACOM.

## Travaux

- Endpoints REST préfixés `/api`.
- Validation des entrées via les schémas Zod partagés.
- Données simulées (utilisateurs démo, véhicules, inspections).
- Erreurs HTTP structurées.
- Moteur de scénarios pour injecter latence et pannes.

## Critères de sortie

- [x] Build NestJS passe.
- [x] Parcours nominal disponible (login → véhicules → inspection).
- [x] Erreurs principales démontrables (API lente, API indisponible, sauvegarde refusée).
