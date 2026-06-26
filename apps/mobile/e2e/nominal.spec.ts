import { expect, test } from '@playwright/test';

test('parcours nominal : connexion → véhicule → mesure → résultat', async ({
  page,
}) => {
  await page.goto('/');

  // Redirection vers la connexion (compte de démonstration pré-rempli).
  await expect(page.getByTestId('login-submit')).toBeVisible();
  await page.getByTestId('login-submit').click();

  // Sélection d'un véhicule fictif.
  await expect(page.getByTestId('vehicle-veh-001')).toBeVisible();
  await page.getByTestId('vehicle-veh-001').click();

  // Démarrage du contrôle.
  await page.getByTestId('start-inspection').click();

  // Connexion au SCANDIAG simulé.
  await page.getByTestId('connect').click();
  await expect(page.getByTestId('device-state')).toHaveText('Connecté');

  // Mesure d'un pneu.
  await page.getByTestId('measure-front-left').click();
  await expect(page.getByTestId('measure-front-left')).toContainText('Refaire');

  // Mesure d'un disque.
  await page.getByTestId('type-brake-disc').click();
  await page.getByTestId('measure-front-left').click();
  await expect(page.getByTestId('measure-front-left')).toContainText('Refaire');

  // Clôture et synthèse.
  await page.getByTestId('complete').click();
  await expect(page.getByTestId('result-done')).toBeVisible();
});
