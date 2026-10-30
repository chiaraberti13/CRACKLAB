import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home screen has no WCAG A/AA violations', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /debole|weak/i }).click();
  await expect(page.getByRole('heading', { name: /stessa password|same password/i })).toBeVisible();

  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
