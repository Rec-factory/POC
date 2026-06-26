import { expect, test } from '@playwright/test';

test('scénario d’erreur : aucun appareil trouvé', async ({ page }) => {
  await page.goto('/login');
  await page.getByTestId('login-submit').click();
  await expect(page.getByTestId('vehicle-veh-001')).toBeVisible();

  // Active le scénario « aucun appareil trouvé ».
  await page.getByTestId('open-demo').click();
  await page.getByTestId('scenario-no-device').click();
  await page.goBack();

  // Tente un contrôle : la recherche ne renvoie aucun appareil.
  await page.getByTestId('vehicle-veh-001').click();
  await page.getByTestId('start-inspection').click();
  await page.getByTestId('connect').click();

  await expect(page.getByTestId('inspection-error')).toContainText(
    'Aucun appareil',
  );
});
