import { expect, test } from '@playwright/test';

test('loads with a single main heading and the tagline', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('CrackLab');
  await expect(page.getByText(/non predice quando|does(n.t| not) predict/i)).toBeVisible();
});

test('a preloaded example produces the four-algorithm comparison', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /debole|weak/i }).click();
  await expect(page.getByRole('heading', { name: /stessa password|same password/i })).toBeVisible();
  for (const algorithm of ['MD5', 'SHA-256', 'bcrypt', 'Argon2id']) {
    await expect(page.getByRole('rowheader', { name: algorithm })).toBeVisible();
  }
});

test('the language toggle switches the interface', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.getByText(/it does(n.t| not) predict/i)).toBeVisible();
  await page.getByRole('button', { name: 'Italiano' }).click();
  await expect(page.getByText(/non predice quando/i)).toBeVisible();
});

test('benchmark details follow the scenario and work on a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: /debole|weak/i }).click();
  const row = page.getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'Argon2id' }) });
  await row.locator('summary').click();
  await expect(row.locator('details')).toHaveAttribute('open', '');
  await expect(row).toContainText('m=19MiB');
  await expect(row).toContainText('2026-10-30');
  await expect(row).toContainText(/Non è una misurazione locale|not a local measurement/);
  await expect(page.locator('body')).toHaveJSProperty('scrollWidth', 390);
});

test('the developer lab really runs the KDFs locally on a synthetic input', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /esegui il confronto reale|run the real comparison/i }).click();
  await expect(page.getByText(/il kdf più lento costa|slowest kdf costs/i)).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText(/Argon2id: /)).toBeVisible();
});
