import { expect, test } from '@playwright/test';

/**
 * The core promise, tested: while typing and evaluating a sample, nothing leaves
 * the browser. Every request must stay same-origin (the app's own bundle and lazy
 * chunks), and no request may carry the typed value in its URL or body.
 */
const CANARY = 'zzz-privacy-canary-5942';

test('no password data leaves the browser while typing and evaluating', async ({ page, baseURL }) => {
  const origin = new URL(baseURL ?? 'http://127.0.0.1:4173').origin;
  const offOrigin: string[] = [];
  const leaked: string[] = [];

  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith(origin) && !url.startsWith('data:') && !url.startsWith('blob:')) {
      offOrigin.push(url);
    }
    const body = request.postData() ?? '';
    if (url.includes(CANARY) || body.includes(CANARY)) {
      leaked.push(url);
    }
  });

  await page.goto('/');
  const input = page.getByLabel(/password di prova|sample password/i);
  await input.fill(CANARY);
  // Let the debounced local evaluation and any lazy dictionary chunks load.
  await expect(page.getByText(/tentativi stimati|estimated guesses/i)).toBeVisible();
  await page.waitForTimeout(500);

  expect(offOrigin, `off-origin requests: ${offOrigin.join(', ')}`).toEqual([]);
  expect(leaked, `requests carrying the sample: ${leaked.join(', ')}`).toEqual([]);
});
