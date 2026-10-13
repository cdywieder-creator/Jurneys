import { test, expect } from '@playwright/test';

test('all six scenes render and the generated Kie.ai plane loads', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText(/Make your business.*take off/);
  await expect(page.locator('.hero-plane')).toHaveAttribute('src', /generated\/plane-cutout/);
  expect(await page.locator('.hero-plane').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole('heading', { name: 'Give them a reason to stop.' })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'A physical product. A powerful digital impression.' })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'Complex ideas. Clearly presented.' })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'Every good journey leads somewhere.' })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'From a first idea to ready for takeoff.' })).toBeAttached();
  await expect(page.getByRole('heading', { name: 'Where could your website take you?' })).toBeAttached();
  expect(errors).toEqual([]);
});

test('navigation goes directly to the portfolio and inquiry section', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.locator('.header nav').getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('.work-heading')).toBeInViewport();
  await page.locator('.nav-cta').click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact-title')).toBeInViewport();
});

test('actual project links and keyboard-dismissable live preview work', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Explore FillPack/ })).toHaveAttribute('href', 'https://fillpackusa.com/');
  await expect(page.getByRole('link', { name: /Explore MRBL/ })).toHaveAttribute('href', 'https://mrbl-management-website.replit.app');
  await page.route('https://fillpackusa.com/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Live preview fixture</h1>' }));
  const button = page.getByRole('button', { name: 'Interact with the live FillPack website' });
  await button.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('iframe')).toHaveAttribute('src', 'https://fillpackusa.com/');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(button).toBeFocused();
});

test('an unconfigured inquiry never reports success and can be downloaded', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your name').fill('Alex Taylor');
  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByLabel('What do you have in mind?').fill('We need a new website for our local business.');
  await page.getByRole('button', { name: /Let's talk about your website/ }).click();
  await expect(page.getByRole('status')).toContainText('Your message has not been sent');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: /Save your inquiry/ }).click();
  expect((await downloaded).suggestedFilename()).toBe('journeys-inquiry.txt');
});

test('successful delivery reports confirmation and resets the form', async ({ page }) => {
  await page.route('**/api/inquiry', route => route.fulfill({ status: 200, contentType: 'application/json', body: '{"sent":true}' }));
  await page.goto('/');
  await page.getByLabel('Your name').fill('Alex');
  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByLabel('What do you have in mind?').fill('A custom website for our business.');
  await page.getByRole('button', { name: /Let's talk about your website/ }).click();
  await expect(page.getByRole('status')).toContainText('Your inquiry has been sent');
  await expect(page.getByLabel('Your name')).toHaveValue('');
});

test('layouts stay within the viewport on phones, tablets and desktops', async ({ page }) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `Overflow at ${width}px`).toBe(true);
    await expect(page.locator('.nav-cta')).toBeInViewport();
    await expect(page.locator('.header nav a').first()).toBeInViewport();
  }
});

test('reduced motion preserves the complete readable sequence without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.locator('.hero-plane').evaluate(element => getComputedStyle(element).animationName)).toBe('none');
  expect(await page.locator('.journey-plane').evaluate(element => getComputedStyle(element).display)).toBe('none');
  expect(await page.locator('.reveal').evaluateAll(elements => elements.every(element => getComputedStyle(element).opacity === '1'))).toBe(true);
  await page.getByRole('heading', { name: 'Launch', exact: true }).scrollIntoViewIfNeeded();
  await expect(page.getByRole('heading', { name: 'Launch', exact: true })).toBeInViewport();
});
