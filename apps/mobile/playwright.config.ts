import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Localise le Chromium pré-installé de l'environnement (révision parfois
 * différente de celle attendue par @playwright/test). Renvoie undefined
 * sur une machine standard, où Playwright utilise son navigateur.
 */
function resolveChromium(): string | undefined {
  if (process.env.PW_CHROMIUM_PATH) {
    return process.env.PW_CHROMIUM_PATH;
  }
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!base || !existsSync(base)) {
    return undefined;
  }
  const dir = readdirSync(base).find((entry) => entry.startsWith('chromium-'));
  if (!dir) {
    return undefined;
  }
  const candidate = join(base, dir, 'chrome-linux', 'chrome');
  return existsSync(candidate) ? candidate : undefined;
}

const chromiumPath = resolveChromium();

/**
 * Configuration des tests de bout en bout. Démarre l'API simulée et le
 * serveur de développement Ionic, puis exécute les parcours.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: {
        ...devices['Pixel 5'],
        launchOptions: chromiumPath ? { executablePath: chromiumPath } : {},
      },
    },
  ],
  webServer: [
    {
      command: 'node -r ts-node/register src/main.ts',
      cwd: '../api',
      port: 3333,
      env: { PORT: '3333' },
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: 'npm run start',
      port: 4200,
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
});
