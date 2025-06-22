import { test, expect } from "@playwright/test";

test.describe("Weather Subscription Form", () => {
  test("Subscribes successfully with valid data", async ({ page }) => {
    const email = `test${Date.now()}@gmail.com`;

    await page.goto("http://localhost:8080");

    await page.fill("#email", email);
    await page.fill("#city", "Kyiv");
    await page.selectOption("#frequency", "Daily");
    await page.click('button[type="submit"]');

    await expect(page.locator("#successMsg")).toBeVisible();
  });

  test("Shows error when email is already subscribed", async ({ page }) => {
    const reusedEmail = `test${Date.now()}@gmail.com`;

    await page.goto("http://localhost:8080");

    await page.fill("#email", reusedEmail);
    await page.fill("#city", "Lviv");
    await page.selectOption("#frequency", "Hourly");
    await page.click('button[type="submit"]');

    await expect(page.locator("#successMsg")).toBeVisible();

    await page.reload({ waitUntil: "load" });

    await page.fill("#email", reusedEmail);
    await page.fill("#city", "Lviv");
    await page.selectOption("#frequency", "Hourly");
    await page.click('button[type="submit"]');

    await expect(page.locator("#errorMsg")).toBeVisible();
  });
});
