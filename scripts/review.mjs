import { chromium } from "@playwright/test";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
let errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:5173");
await page.waitForTimeout(1500);
await page.screenshot({ path: "review/01-opening.png" });
await page.mouse.wheel(0, 1150);
await page.waitForTimeout(2500);
await page.screenshot({ path: "review/02-bank.png" });
const stopped = await page
  .locator("#flight-world")
  .getAttribute("data-progress");
await page.waitForTimeout(600);
if (
  stopped !==
  (await page.locator("#flight-world").getAttribute("data-progress"))
)
  throw Error("Flight moves while stopped");
await page.mouse.wheel(0, 1000);
await page.waitForTimeout(2500);
await page.screenshot({ path: "review/03-climb.png" });
await page.mouse.wheel(0, -1400);
await page.waitForTimeout(2500);
if (
  Number(await page.locator("#flight-world").getAttribute("data-progress")) >=
  Number(stopped)
)
  throw Error("Reverse scroll failed");
await page.locator('nav a[href="#work"]').click();
await page.waitForTimeout(1500);
await page.screenshot({ path: "review/04-work.png" });
await page.locator('nav a[href="#contact"]').click();
await page.waitForTimeout(1500);
await page.locator("[name=name]").fill("Review");
await page.locator("[name=email]").fill("review@example.com");
await page.locator("[name=message]").fill("A custom website for my business.");
await page.locator("[type=submit]").click();
await page.waitForTimeout(500);
if (
  !(await page.locator("#form-status").textContent()).includes("not been sent")
)
  throw Error("Honest unsent behavior failed");
await page.screenshot({ path: "review/05-contact.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:5173");
await page.waitForTimeout(1000);
await page.screenshot({ path: "review/06-mobile.png" });
if (
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
)
  throw Error("Mobile overflow");
await page.emulateMedia({ reducedMotion: "reduce" });
await page.reload();
await page.waitForTimeout(1000);
await page.screenshot({ path: "review/07-reduced-motion.png" });
if (
  !(await page
    .locator("body")
    .evaluate((e) => e.classList.contains("reduced-motion")))
)
  throw Error("Reduced motion failed");
console.log({
  errors,
  checks:
    "forward, stop, reverse, navigation, inquiry, mobile, reduced motion passed",
});
await browser.close();
