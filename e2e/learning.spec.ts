import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { createHash } from 'node:crypto';
import { lessonIds, lessons } from '../src/lessons/catalog';

for (const id of lessonIds) {
  test('guided lesson, keyboard, quiz and fixed export: ' + id, async ({ page }) => {
    const lesson = lessons.it[id];
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/capisci/' + id + '/');
    await expect(page).toHaveTitle(new RegExp('CrackLab'));
    const prediction = page.getByRole('button', { name: lesson.prediction[lesson.correct], exact: true });
    await prediction.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('Tab');
    const run = page.getByRole('button', { name: 'Mostra l’esperimento' });
    await run.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText('Previsione corretta.')).toBeVisible();
    await page.getByRole('checkbox').uncheck();
    await page.getByText('Verifica cosa hai capito').click();
    await page.getByRole('button', { name: lesson.choices[lesson.answer], exact: true }).last().click();
    await expect(page.getByText('Corretto.', { exact: true })).toBeVisible();
    const card = await page.getByRole('link', { name: 'Scarica la scheda didattica' }).getAttribute('href');
    expect(decodeURIComponent(card!)).toContain(lesson.title);
    await expect(page.getByText(lesson.defense, { exact: false })).toBeVisible();
    expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual(
      []
    );
  });
}

test('offline reload includes unvisited lesson and strength dictionaries', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.goto('/capisci/mfa/');
  await expect(page.getByRole('heading', { name: lessons.it.mfa.title })).toBeVisible();
  await page.getByRole('link', { name: 'Prova', exact: true }).click();
  await page.getByRole('button', { name: 'Debole' }).click();
  await expect(page.getByRole('rowheader', { name: 'Argon2id' })).toBeVisible();
});

test('developer controls invalidate the report and preserve the memory bound', async ({ page }) => {
  await page.goto('/progetta/');
  await page.getByRole('combobox', { name: 'Algoritmo', exact: true }).selectOption('argon2id');
  await page.getByRole('slider').focus();
  await page.keyboard.press('End');
  await expect(page.getByText(/⌊256 \/ 64⌋ = 4/)).toBeVisible();
  await page.getByRole('button', { name: 'Esegui il confronto reale' }).click();
  const report = page.getByRole('link', { name: 'Esporta il report locale' });
  await expect(report).toBeVisible();
  const data = JSON.parse(decodeURIComponent((await report.getAttribute('href'))!.split(',').slice(1).join(',')));
  expect(data.parameters.argonMemoryMiB).toBe(64);
  expect(data.timings.map((row: { algorithm: string }) => row.algorithm)).toEqual(['argon2id']);
  await page.keyboard.press('Home');
  await page.getByRole('combobox', { name: 'Algoritmo', exact: true }).selectOption('bcrypt');
  await expect(report).toHaveCount(0);
  await page.getByRole('button', { name: 'Genera esempio' }).click();
  expect((await page.locator('output').innerText()).split('-')).toHaveLength(12);
  await page.getByRole('button', { name: 'Tema chiaro' }).click();
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
});

test.describe('consented range request', () => {
  test.use({ serviceWorkers: 'block' });
  test('only a padded prefix leaves on submit and a zero-count match is ignored', async ({ page, context }) => {
    const sample = 'invented-range-canary-718';
    const hex = createHash('sha1').update(sample).digest('hex').toUpperCase();
    const calls: string[] = [];
    await context.route('https://api.pwnedpasswords.com/**', async (route) => {
      calls.push(route.request().url());
      expect(route.request().headers()['add-padding']).toBe('true');
      expect(route.request().postData()).toBeNull();
      await route.fulfill({
        contentType: 'text/plain',
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: hex.slice(5) + ':' + (calls.length === 1 ? '0' : '7')
      });
    });
    await page.goto('/hibp/');
    await page.getByLabel('Esempio inventato', { exact: true }).fill(sample);
    await expect(page.getByRole('button', { name: 'Verifica', exact: true })).toBeDisabled();
    await page.getByRole('checkbox').check();
    expect(calls).toEqual([]);
    await page.getByRole('button', { name: 'Verifica', exact: true }).click();
    await expect(page.getByRole('status')).toContainText('assente');
    await page.getByRole('button', { name: 'Verifica', exact: true }).click();
    await expect(page.getByRole('status')).toHaveText('Esempio presente nel corpus.');
    expect(calls).toEqual(Array(2).fill('https://api.pwnedpasswords.com/range/' + hex.slice(0, 5)));
  });
});

test('changing a sample clears stale comparisons immediately and clear removes results', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Debole', exact: true }).click();
  const comparison = page.getByRole('heading', { name: 'Stessa password, quattro algoritmi' });
  await expect(comparison).toBeVisible();
  await page.getByRole('button', { name: 'Passphrase', exact: true }).click();
  expect(await comparison.count()).toBe(0);
  await expect(comparison).toBeVisible();
  await page.getByRole('button', { name: 'Svuota tutto' }).click();
  await expect(comparison).toHaveCount(0);
  await expect(page.getByLabel('Password di prova', { exact: true })).toBeEmpty();
});

test('synthetic logs show a denied second factor and work spaces reflect salts', async ({ page }) => {
  await page.goto('/capisci/mfa/');
  await page.getByRole('button', { name: 'Sì', exact: true }).click();
  await page.getByRole('button', { name: 'Mostra l’esperimento' }).click();
  await page.getByText('Confronta i controlli su tre registri sintetici').click();
  await page.getByRole('combobox', { name: 'Registro' }).selectOption('stuffing');
  await page.getByRole('combobox', { name: 'Controllo applicato' }).selectOption('mfa');
  const details = page.locator('details[open]');
  await expect(details.getByText('Accessi completati').locator('..')).toHaveText('Accessi completati0');
  await page.goto('/capisci/salt/');
  await page.getByRole('button', { name: 'No', exact: true }).click();
  await page.getByRole('button', { name: 'Mostra l’esperimento' }).click();
  await page.getByText('Confronta il lavoro su due record').click();
  await page.getByRole('combobox').selectOption('mask');
  await expect(page.getByText('Verifiche complessive').locator('..')).toHaveText('Verifiche complessive32');
});

test('quiz retries do not inflate the first-response count', async ({ page }) => {
  await page.goto('/capisci/mfa/');
  await page.getByRole('button', { name: 'Sì', exact: true }).click();
  await page.getByRole('button', { name: 'Mostra l’esperimento' }).click();
  await page.getByText('Verifica cosa hai capito').click();
  await page.getByRole('button', { name: 'Subito dopo la password' }).click();
  await page.getByRole('button', { name: 'Dopo tutti i fattori richiesti' }).click();
  await page.getByText('Risultati della lezione').click();
  const link = page.getByRole('link', { name: 'Esporta i conteggi anonimi' });
  const report = JSON.parse(decodeURIComponent((await link.getAttribute('href'))!.split(',')[1]));
  expect(report).toEqual({ lesson: 'mfa', responses: 1, correct: 0 });
});
