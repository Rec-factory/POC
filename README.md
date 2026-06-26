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

## Démarrage rapide

Prérequis : Node.js ≥ 20 et npm ≥ 10.

```bash
# 1. Installer les dépendances du monorepo
npm install

# 2. Construire les packages partagés
npm run build:packages

# 3. Démarrer l'API simulée (http://localhost:3333/api)
npm run api:dev

# 4. Dans un autre terminal, démarrer l'application (http://localhost:4200)
npm run mobile:dev
```

Ouvrir http://localhost:4200, se connecter avec un compte de
démonstration, choisir un véhicule, démarrer un contrôle, connecter le
SCANDIAG simulé, réaliser des mesures puis consulter la synthèse.

## Comptes de démonstration

| E-mail            | Mot de passe | Rôle       |
| ----------------- | ------------ | ---------- |
| `demo@facom.test` | `demo`       | démo       |
| `tech@facom.test` | `scandiag`   | technicien |

Aucune donnée personnelle réelle, plaques d'immatriculation fictives.

## Commandes utiles

| Commande                 | Effet                                      |
| ------------------------ | ------------------------------------------ |
| `npm run build`          | Construit tous les workspaces              |
| `npm run build:packages` | Construit contracts, core et test-fixtures |
| `npm run api:dev`        | Démarre l'API NestJS simulée               |
| `npm run mobile:dev`     | Démarre l'application Ionic Angular        |
| `npm run test:unit`      | Tests unitaires (domaine, fixtures) et API |
| `npm run e2e`            | Tests de bout en bout Playwright           |
| `npm run lint`           | ESLint sur l'ensemble du dépôt             |
| `npm run format`         | Formatage Prettier                         |

## Mode démonstration

Le mode démonstration (icône fiole dans la liste des véhicules, ou lien
depuis la connexion) permet de choisir un scénario **déterministe** :
parcours nominal, aucun appareil, connexion impossible, batterie faible,
déconnexion pendant la mesure, mesures correcte / à surveiller /
critique / invalide, API lente, API indisponible, sauvegarde refusée.

## Architecture

```text
apps/
  api/      API NestJS simulée (REST /api, validation Zod, scénarios)
  mobile/   Application Ionic Angular (ports, adaptateurs, Signals)
packages/
  contracts/      schémas Zod et types partagés
  scandiag-core/  domaine : ports, évaluation des mesures, cas d'usage
  test-fixtures/  scénarios de démonstration déterministes
docs/       plan d'action, architecture, étapes, procédure Android
```

Les pages dépendent de cas d'usage, qui dépendent des ports
(`FacomApiPort`, `ScandiagDevicePort`). Les adaptateurs
(`HttpFacomApiAdapter`, `MockScandiagAdapter`) implémentent ces ports.
Le domaine ne dépend ni d'Ionic, ni de NestJS, ni de Capacitor. Voir
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Packaging Android

Voir [`docs/ANDROID.md`](docs/ANDROID.md).

## Avertissement

Toutes les mesures sont **simulées** et ne constituent pas un diagnostic
certifié.
