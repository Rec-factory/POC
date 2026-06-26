# Plan d'action — Phase 0 simulée

## Principe directeur

Cette phase doit prouver la valeur de l'application sans dépendre du matériel.

Le SCANDIAG réel est remplacé par un simulateur logiciel. L'API FACOM est remplacée par une API NestJS contrôlée.

L'objectif n'est pas de prouver la faisabilité Bluetooth. L'objectif est de prouver :

- le parcours utilisateur ;
- la cohérence de l'architecture ;
- l'intérêt métier ;
- la qualité de la restitution ;
- la capacité à intégrer ultérieurement un adaptateur réel.

## Étapes

| Étape | Sujet | Livrable principal |
|---|---|---|
| 00 | Cadrage du POC | périmètre validé |
| 01 | Initialisation | monorepo exécutable |
| 02 | Architecture et contrats | packages partagés |
| 03 | API FACOM simulée | API NestJS |
| 04 | Socle Ionic | navigation et thème |
| 05 | Authentification et véhicules | premier parcours métier |
| 06 | Simulateur SCANDIAG | adaptateur matériel mock |
| 07 | Parcours de contrôle | mesures pneu et disque |
| 08 | Résultats et historique | synthèse et sauvegarde |
| 09 | Mode démonstration | scénarios contrôlables |
| 10 | Tests et qualité | couverture des parcours |
| 11 | Packaging Android | application Capacitor |
| 12 | Stabilisation | version démontrable |

## Critère de sortie de phase 0

Une personne doit pouvoir, depuis un smartphone Android :

1. ouvrir l'application ;
2. se connecter avec un compte de démonstration ;
3. sélectionner un véhicule fictif ;
4. rechercher un SCANDIAG simulé ;
5. se connecter au simulateur ;
6. réaliser une mesure simulée ;
7. consulter le résultat ;
8. terminer le contrôle ;
9. retrouver le contrôle dans l'historique ;
10. rejouer un scénario d'erreur.

La démonstration ne doit nécessiter ni appareil physique, ni connexion Bluetooth réelle.
