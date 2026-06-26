# Packaging Android (Capacitor)

Le POC est packageable en application Android via Capacitor. Aucune
fonctionnalité Bluetooth native n'est utilisée : l'appareil reste simulé.

## Prérequis

- Android Studio et le SDK Android installés ;
- un JDK compatible ;
- la variable `ANDROID_HOME` configurée.

## Génération

Depuis `apps/mobile/` :

```bash
# 1. Construire l'application web
npm run build

# 2. Ajouter la plateforme Android (une seule fois)
npm run cap:add:android

# 3. Synchroniser le web et les plugins vers le projet natif
npm run cap:sync

# Étapes 1 + 3 combinées :
npm run build:android
```

## Compilation de l'APK

```bash
# Ouvrir le projet dans Android Studio
npx cap open android

# ou en ligne de commande, depuis apps/mobile/android/
./gradlew assembleDebug
```

L'APK de debug est généré dans
`apps/mobile/android/app/build/outputs/apk/debug/`.

## Configuration

La configuration se trouve dans `apps/mobile/capacitor.config.ts` :

- `appId` : `com.facom.scandiag.poc` ;
- `appName` : `FACOM SCANDIAG POC` ;
- `webDir` : `www` (sortie du build Angular).

## Note

Le dossier `android/` natif n'est pas versionné dans ce dépôt : il est
régénéré par `npm run cap:add:android`. Adaptez `apiBaseUrl`
(`src/environments/environment.ts`) pour pointer vers l'API simulée
accessible depuis l'appareil ou l'émulateur.
