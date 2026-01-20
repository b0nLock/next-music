// e2e/home.spec.ts
import { test, expect } from "@playwright/test";

test("basic nextjs test", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // ✅ ПЕРВЫЙ способ — .first() внутри expect
  await expect(page.locator("div").first()).toBeVisible();
});
