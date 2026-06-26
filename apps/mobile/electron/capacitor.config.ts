import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Configuration Capacitor pour le packaging Android du POC.
 * Aucune dépendance Bluetooth native n'est déclarée : toute interaction
 * avec l'appareil passe par le simulateur logiciel.
 */
const config: CapacitorConfig = {
  appId: 'com.facom.scandiag.poc',
  appName: 'FACOM SCANDIAG POC',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
};

export default config;
