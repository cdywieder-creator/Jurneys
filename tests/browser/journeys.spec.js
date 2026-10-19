import { test, expect } from "@playwright/test";
test("flight follows forward scrolling, settles, and reverses", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("#flight-world canvas")).toBeVisible();
  await page.mouse.wheel(0, 800);
  await expect
    .poll(async () =>
      Number(await page.locator("#flight-world").getAttribute("data-progress")),
    )
    .toBeGreaterThan(0.2);
  await page.waitForTimeout(2000);
  const stopped = Number(
    await page.locator("#flight-world").getAttribute("data-progress"),
  );
  await page.waitForTimeout(500);
  expect(
    Number(await page.locator("#flight-world").getAttribute("data-progress")),
  ).toBeCloseTo(stopped, 3);
  await page.mouse.wheel(0, -600);
  await expect
    .poll(async () =>
      Number(await page.locator("#flight-world").getAttribute("data-progress")),
    )
    .toBeLessThan(stopped - 0.1);
});
test("navigation brings actual work and inquiry into view", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('nav a[href="#work"]').click();
  await expect(page.locator("#work h2")).toBeInViewport();
  await expect(
    page.getByRole("link", {
      name: "Visit FillPack website (opens in a new tab)",
    }),
  ).toHaveAttribute("href", "https://fillpackusa.com/");
  await expect(
    page.getByRole("link", { name: "Visit MRBL website (opens in a new tab)" }),
  ).toHaveAttribute("href", "https://mrbl-management-website.replit.app");
  await page.locator(".nav-cta").click();
  await expect(page.locator("#contact-title")).toBeInViewport();
});
test("reduced motion keeps the aircraft static and all content accessible", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("body")).toHaveClass(/reduced-motion/);
  await page.mouse.wheel(0, 400);
  await expect(page.locator("#flight-world")).toHaveAttribute(
    "data-progress",
    "0.0000",
  );
  await page.locator('nav a[href="#work"]').click();
  await expect(page.locator("#work h2")).toBeInViewport();
});
test("small phones and tablets keep navigation and content inside the viewport", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".nav-cta")).toBeInViewport();
  }
});
test("unconfigured inquiries remain unsent and can be downloaded", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByLabel("Your name").fill("Alex Taylor");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page
    .getByLabel("What do you have in mind?")
    .fill("A new website for our business.");
  await page
    .getByRole("button", { name: /Let.s talk about your website/ })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Your message has not been sent",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: /Save your inquiry/ }).click();
  expect((await download).suggestedFilename()).toBe("journeys-inquiry.txt");
});
