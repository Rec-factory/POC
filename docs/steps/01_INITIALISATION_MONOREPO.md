# Étape 01 — Initialisation du monorepo

## Objectif

Disposer d'un monorepo npm workspaces exécutable.

## Travaux

- `package.json` racine avec workspaces `apps/*` et `packages/*`.
- `tsconfig.base.json` strict partagé.
- Configuration ESLint + Prettier.
- Scripts racine (`build`, `test`, `lint`, `format`).

## Critères de sortie

- [x] `npm install` fonctionne à la racine.
- [x] TypeScript strict activé.
- [x] Lint et format configurés.
