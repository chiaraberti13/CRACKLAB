import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// A small, common phone width. Everything must fit with no horizontal page scroll.
test.use({ viewport: { width: 375, height: 667 } });

async function expectNoHorizontalScroll(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  // Allow a sub-pixel rounding margin only.
  expect(overflow).toBeLessThanOrEqual(1);
}

test('Try screen fits a phone and the comparison stacks into cards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /debole|weak/i }).click();
  await expect(page.getByRole('heading', { name: /stessa password|same password/i })).toBeVisible();
  await expectNoHorizontalScroll(page);
});

test('Design (KDF lab) screen fits a phone', async ({ page }) => {
  await page.goto('/progetta/');
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
  await expectNoHorizontalScroll(page);
});

test('a guided lesson fits a phone', async ({ page }) => {
  await page.goto('/capisci/salt/');
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
  await expectNoHorizontalScroll(page);
});

test('the hamburger menu reveals navigation on a phone', async ({ page }) => {
  await page.goto('/');
  const menuButton = page.getByRole('button', { name: /apri menu|open menu/i });
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  const menu = page.locator('#mobile-menu');
  await expect(menu.getByRole('link', { name: /capisci|learn/i })).toBeVisible();
  await menu.getByRole('link', { name: /capisci|learn/i }).click();
  await expect(page).toHaveURL(/\/capisci\//);
});

test('no WCAG A/AA violations at phone width', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /debole|weak/i }).click();
  await expect(page.getByRole('heading', { name: /stessa password|same password/i })).toBeVisible();
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
