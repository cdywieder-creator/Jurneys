import { test, expect } from '@playwright/test';

async function scene(page, progress) {
  await page.evaluate(p => {
    const story = document.querySelector('.film-story');
    const stage = document.querySelector('.film-stage');
    scrollTo({ top: story.offsetTop + (story.offsetHeight - stage.offsetHeight) * p, behavior: 'instant' });
  }, progress);
  await expect.poll(async () => Number(await page.locator('.film-stage').getAttribute('data-progress'))).toBeCloseTo(progress, 2);
}

test('the opening is complete and the film contains real rendered frames', async ({ page }) => {
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText(/Make your.*business.*take off/);
  await expect(page.locator('.movie-canvas')).toHaveClass(/is-ready/);
  await expect(page.locator('.film-stage')).toHaveAttribute('data-frame-count', '192');
  await expect(page.locator('.opening-work img')).toHaveCount(2);
  expect(errors).toEqual([]);
});

test('native scrolling advances, pauses, and reverses the actual film', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveAttribute('data-frame', '0');
  await scene(page, 0.365);
  await expect(page.locator('.film-stage')).toHaveAttribute('data-chapter', '2');
  await expect.poll(async()=>Number(await page.locator('canvas').getAttribute('data-frame'))).toBe(70);
  const pixels = await page.locator('canvas').evaluate(canvas=>canvas.getContext('2d').getImageData(0,0,100,100).data.slice(0,16).join(','));
  await page.waitForTimeout(500);
  await expect(page.locator('canvas')).toHaveAttribute('data-frame', '70');
  expect(await page.locator('canvas').evaluate(canvas=>canvas.getContext('2d').getImageData(0,0,100,100).data.slice(0,16).join(','))).toBe(pixels);
  await scene(page,0.08);
  await expect.poll(async()=>Number(await page.locator('canvas').getAttribute('data-frame'))).toBe(15);
});

test('work navigation seeks directly to a fully readable showcase', async ({ page }) => {
  await page.goto('/');
  await page.locator('.header nav').getByRole('link',{name:'Work',exact:true}).click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('.scene-fillpack')).toHaveClass(/is-active/);
  await expect.poll(()=>page.locator('.scene-fillpack').evaluate(element=>Number(getComputedStyle(element).opacity))).toBeGreaterThan(0.95);
  await expect(page.getByRole('heading',{name:'A physical product. A powerful digital impression.'})).toBeVisible();
  await page.locator('.nav-cta').click();
  await expect(page).toHaveURL(/#contact$/);
  await expect(page.locator('#contact-title')).toBeInViewport();
});

test('large project previews link to actual sites and support keyboard dismissal', async ({ page }) => {
  await page.goto('/');
  await scene(page,0.365);
  await expect(page.getByRole('link',{name:/Explore FillPack/})).toHaveAttribute('href','https://fillpackusa.com/');
  await page.route('https://fillpackusa.com/**',route=>route.fulfill({contentType:'text/html',body:'<h1>Live preview fixture</h1>'}));
  const button=page.getByRole('button',{name:'Interact with the live FillPack website'});
  await button.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('iframe')).toHaveAttribute('src','https://fillpackusa.com/');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(button).toBeFocused();
});

test('reduced motion shows all scenes and navigation remains useful', async ({ page }) => {
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('body')).toHaveClass(/reading-mode/);
  expect(await page.locator('.scene').evaluateAll(elements=>elements.every(element=>getComputedStyle(element).opacity==='1'&&!element.inert))).toBe(true);
  await page.locator('.header nav').getByRole('link',{name:'Work',exact:true}).click();
  await expect(page.locator('.scene-fillpack')).toBeInViewport();
  await expect(page.getByRole('heading',{name:'Launch',exact:true})).toBeAttached();
  await expect(page.locator('canvas')).not.toHaveClass(/is-ready/);
});

test('the less-motion switch can return to the cinematic journey', async ({ page }) => {
  await page.goto('/');
  await scene(page,0.55);
  await page.getByRole('button',{name:'Less motion',exact:true}).click();
  await expect(page.locator('body')).toHaveClass(/reading-mode/);
  await expect(page.locator('.scene-mrbl')).toBeInViewport();
  await page.getByRole('button',{name:'Return to cinematic journey'}).click();
  await expect(page.locator('body')).not.toHaveClass(/reading-mode/);
  await expect(page.locator('.film-stage')).toHaveAttribute('data-chapter','3');
});

test('phone and desktop layouts contain readable project scenes without horizontal overflow', async ({ page }) => {
  for (const width of [320,390,768,1440]) {
    await page.setViewportSize({width,height:900});
    await page.goto('/');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`).toBe(true);
    await expect(page.locator('.nav-cta')).toBeInViewport();
    await scene(page,0.365);
    await expect(page.locator('.scene-fillpack .project-open')).toBeInViewport();
    await expect(page.locator('.scene-fillpack .button')).toBeInViewport();
    const objects=await page.locator('.header').evaluate(header=>{const logo=header.querySelector('.wordmark').getBoundingClientRect(),nav=header.querySelector('nav').getBoundingClientRect();return {logoRight:logo.right,navLeft:nav.left};});
    expect(objects.logoRight).toBeLessThan(objects.navLeft);
  }
});

test('inquiries never claim delivery before a destination is configured', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Your name').fill('Alex Taylor');
  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByLabel('What do you have in mind?').fill('We need a new website for our local business.');
  await page.getByRole('button',{name:/Let's talk about your website/}).click();
  await expect(page.getByRole('status')).toContainText('Your message has not been sent');
  const downloaded=page.waitForEvent('download');
  await page.getByRole('button',{name:/Save your inquiry/}).click();
  expect((await downloaded).suggestedFilename()).toBe('journeys-inquiry.txt');
});

test('confirmed inquiry delivery resets the form', async ({ page }) => {
  await page.route('**/api/inquiry',route=>route.fulfill({status:200,contentType:'application/json',body:'{"sent":true}'}));
  await page.goto('/');
  await page.getByLabel('Your name').fill('Alex');
  await page.getByLabel('Email address').fill('alex@example.com');
  await page.getByLabel('What do you have in mind?').fill('A custom website for our business.');
  await page.getByRole('button',{name:/Let's talk about your website/}).click();
  await expect(page.getByRole('status')).toContainText('Your inquiry has been sent');
  await expect(page.getByLabel('Your name')).toHaveValue('');
});
