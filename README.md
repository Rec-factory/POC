# FACOM SCANDIAG Mobile POC

## Objectif

Ce dépôt contient le cadrage de réalisation d'un POC mobile pour donner une seconde vie au FACOM SCANDIAG.

Le POC doit démontrer une expérience mobile complète permettant de :

- se connecter à une API FACOM simulée ;
- rechercher et connecter un SCANDIAG simulé ;
- lancer une mesure simulée d'un pneu ou d'un disque de frein ;
- afficher un résultat clair ;
- rattacher les mesures à un véhicule ;
- consulter l'historique des contrôles ;
- présenter plusieurs scénarios de démonstration fiables.

## Périmètre de la phase 0

La phase 0 repose uniquement sur des simulations.

Sont inclus :

- une application Ionic Angular ;
- une application Android générée avec Capacitor ;
- une API NestJS simulée ;
- des contrats partagés avec Zod ;
- un simulateur de SCANDIAG ;
- des mesures fictives déterministes ;
- un mode démonstration ;
- des tests automatisés.

Sont exclus :

- la connexion Bluetooth réelle ;
- l'analyse du protocole matériel ;
- la communication avec un appareil physique ;
- la certification métrologique ;
- une intégration au système d'information FACOM ;
- la publication sur les stores ;
- une application iOS finalisée.

## Stack retenue

- Ionic Angular ;
- Capacitor ;
- NestJS ;
- TypeScript strict ;
- Zod ;
- Angular Signals ;
- RxJS ;
- Vitest ;
- Playwright ;
- workspaces npm.

## Ordre de réalisation

1. Cadrage et initialisation.
2. Architecture et contrats.
3. API FACOM simulée.
4. Socle Ionic et design system.
5. Authentification et véhicules.
6. Simulateur SCANDIAG.
7. Parcours de contrôle.
8. Résultats et historique.
9. Mode démonstration.
10. Tests et qualité.
11. Packaging Android.
12. Stabilisation et livraison.

Consulter [`docs/PLAN_ACTION.md`](docs/PLAN_ACTION.md) pour le plan complet et [`AGENTS.MD`](AGENTS.MD) pour les règles de développement.
