import { test, expect } from '@playwright/test';

// Pilot: non-destructive browser checks for the existing Church Hymn Companion.
// Run locally against the existing Vite dev server; do not deploy this branch.
test('launches with correct identity and accessible primary heading', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CHURCH HYMN COMPANION/i);
  await expect(page.locator('#root')).toBeVisible();
  await expect(page.locator('body')).not.toContainText('Internal Server Error');
});

test('registers PWA manifest without a missing-file response', async ({ request }) => {
  const response = await request.get('/manifest.json');
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  expect(manifest.name || manifest.short_name).toBeTruthy();
});

test('offers a service worker file for offline support', async ({ request }) => {
  const response = await request.get('/sw.js');
  expect(response.ok()).toBeTruthy();
});

// A meaningful user journey: load the hymn pack, find a known hymn and pin it.
test('searches hymn 247 and adds it to the service setlist', async ({ page }) => {
  await page.goto('/');
  const search = page.getByPlaceholder(/Search by exact hymn number/i);
  await expect(search).toBeVisible();
  await expect(page.getByText('Loading local hymn dataset...')).toBeHidden();
  await search.fill('247');
  await page.getByRole('button', { name: /FIND HYMN/i }).click();
  await expect(page.getByText('# Hymn 247')).toBeVisible();
  await page.getByRole('button', { name: /Pin to Setlist/i }).click();
  await expect(page.getByRole('button', { name: /Remove from Setlist/i })).toBeVisible();
});
