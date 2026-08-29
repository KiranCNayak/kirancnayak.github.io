import { test, expect } from '@playwright/test';

/**
 * Regression checks for the accessibility + taste pass.
 * Each block maps to a finding from the web-interface-guidelines /
 * design-taste-frontend review.
 */

test.describe('accessibility pass', () => {
  test('interactive elements get a visible focus-visible ring', async ({ page }) => {
    await page.goto('/');
    const cta = page.getByRole('link', { name: 'See my work' });
    await cta.focus();
    const outline = await cta.evaluate((el) => {
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor };
    });
    expect(outline.style).not.toBe('none');
    expect(parseFloat(outline.width)).toBeGreaterThan(0);
  });

  test('skip link target is focusable', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main#main')).toHaveAttribute('tabindex', '-1');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toHaveAttribute('href', '#main');
  });

  test('primary nav is labelled', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  });

  test('hero scroll chevron is hidden from assistive tech', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'chevron is hidden on mobile');
    await page.goto('/');
    const svg = page.locator('a[aria-label="Scroll to about section"] svg');
    await expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  test('chevron animation collapses under prefers-reduced-motion', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'chevron is hidden on mobile');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const svg = page.locator('a[aria-label="Scroll to about section"] svg');
    const animation = await svg.evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe('none');
  });

  test('project thumbnails are CLS-safe and described', async ({ page }) => {
    await page.goto('/');
    const imgs = page.locator('#projects article img');
    await expect(imgs).toHaveCount(3);
    for (const img of await imgs.all()) {
      await expect(img).toHaveAttribute('width', /\d+/);
      await expect(img).toHaveAttribute('height', /\d+/);
      await expect(img).toHaveAttribute('loading', 'lazy');
      expect(await img.getAttribute('alt')).not.toBeNull();
    }
  });

  test('blog post headings have scroll-margin for anchor links', async ({ page }) => {
    await page.goto('/blog/hello-world-its-kcn/');
    const h2 = page.locator('.prose-dark h2').first();
    await expect(h2).toHaveAttribute('id', /.+/);
    const smt = await h2.evaluate((el) => getComputedStyle(el).scrollMarginTop);
    expect(parseFloat(smt)).toBeGreaterThanOrEqual(96);
  });
});

test.describe('responsive navigation', () => {
  test('desktop shows inline links, hides the disclosure', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop-only layout');
    await page.goto('/');
    await expect(page.locator('nav > ul')).toBeVisible();
    await expect(page.locator('nav details')).toBeHidden();
  });

  test('mobile collapses to a zero-JS <details> menu with large tap targets', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile-only layout');
    await page.goto('/');
    const details = page.locator('nav details');
    await expect(details).toBeVisible();
    await expect(page.locator('nav > ul')).toBeHidden();

    const summary = details.locator('summary');
    const box = await summary.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(32);
    expect(box!.height).toBeGreaterThanOrEqual(32);

    await summary.click();
    await expect(details).toHaveJSProperty('open', true);
    const firstLink = details.getByRole('link', { name: 'About' });
    const linkBox = await firstLink.boundingBox();
    expect(linkBox!.height).toBeGreaterThanOrEqual(40);
  });
});

test.describe('taste pass', () => {
  const pages = ['/', '/blog/', '/blog/hello-world-its-kcn/', '/404'];

  for (const path of pages) {
    test(`no em-dash or en-dash in visible copy: ${path}`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: 'networkidle' });
      // 404 route returns 404 on preview; still renders the body.
      expect(res).toBeTruthy();
      const text = await page.locator('body').innerText();
      expect(text).not.toContain('—'); // em dash
      expect(text).not.toContain('–'); // en dash
    });
  }

  test('secondary accent is the warm amber, not the AI-violet', async ({ page }) => {
    await page.goto('/');
    const accent2 = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-accent-2').trim(),
    );
    expect(accent2.toLowerCase()).toBe('#f59e0b');
  });

  test('section eyebrows dropped the "0N ·" numbering', async ({ page }) => {
    await page.goto('/');
    const eyebrows = await page.locator('section p.font-mono.uppercase').allInnerTexts();
    for (const e of eyebrows) {
      expect(e).not.toMatch(/^\s*0\d\s*·/);
    }
  });

  test('glow-text gradient is used sparingly (identity moments only)', async ({ page }) => {
    await page.goto('/');
    // hero name is the only glow-text on the landing page now
    await expect(page.locator('.glow-text')).toHaveCount(1);
  });
});
