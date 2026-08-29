import { test } from '@playwright/test';
import { mkdirSync } from 'node:fs';

/**
 * Not assertions — just captures reference screenshots into ./screenshots
 * so the visual result of the design pass can be reviewed.
 * Run with: yarn test:e2e --grep @shot
 */

const dir = 'screenshots';
mkdirSync(dir, { recursive: true });

test.beforeEach(async ({ page }) => {
  // deterministic: freeze the particle hero animation, disable reveal transitions
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('@shot home — full page', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${dir}/${testInfo.project.name}-home.png`, fullPage: true });
});

test('@shot projects section', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page
    .locator('#projects')
    .screenshot({ path: `${dir}/${testInfo.project.name}-projects.png` });
});

test('@shot blog index', async ({ page }, testInfo) => {
  await page.goto('/blog/');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${dir}/${testInfo.project.name}-blog.png`, fullPage: true });
});

test('@shot mobile nav menu open', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'mobile-only');
  await page.goto('/');
  await page.locator('nav details summary').click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${dir}/mobile-nav-open.png` });
});
