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
