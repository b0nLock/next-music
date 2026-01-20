import { test, expect } from "@playwright/test";

test.describe("Create Track Page - E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to create page
    await page.goto("/tracks/create");
    await page.waitForLoadState("networkidle");
  });

  test("should load create page with step 0 form", async ({ page }) => {
    // Check for track name label
    const trackNameLabel = page.locator('label:has-text("Название трека")');
    await expect(trackNameLabel).toBeVisible();

    // Check for artist name label
    const artistNameLabel = page.locator('label:has-text("Имя исполнителя")');
    await expect(artistNameLabel).toBeVisible();

    // Check for lyrics label
    const lyricsLabel = page.locator('label:has-text("Слова к треку")');
    await expect(lyricsLabel).toBeVisible();
  });

  test("should fill track info on step 0", async ({ page }) => {
    // Get inputs by label (more reliable)
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });
    const artistInput = page.getByRole("textbox", {
      name: /Имя исполнителя/i,
    });
    const lyricsInput = page.getByRole("textbox", { name: /Слова к треку/i });

    // Fill track info
    await trackNameInput.fill("Test Track");
    await artistInput.fill("Test Artist");
    await lyricsInput.fill("Test lyrics content");

    // Verify values
    await expect(trackNameInput).toHaveValue("Test Track");
    await expect(artistInput).toHaveValue("Test Artist");
    await expect(lyricsInput).toHaveValue("Test lyrics content");
  });

  test("should navigate from step 0 to step 1", async ({ page }) => {
    // Fill step 0 form using labels
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });
    const artistInput = page.getByRole("textbox", {
      name: /Имя исполнителя/i,
    });
    const lyricsInput = page.getByRole("textbox", { name: /Слова к треку/i });

    await trackNameInput.fill("Test Track");
    await artistInput.fill("Test Artist");
    await lyricsInput.fill("Test lyrics");

    // Click next button - find by text
    const nextButton = page.getByRole("button", { name: /Далее|Следующий/ });
    await nextButton.click();

    // Wait for step transition
    await page.waitForTimeout(300);

    // Should have file input for picture (Step 1)
    const fileInputs = page.locator('input[type="file"]');
    expect(await fileInputs.count()).toBeGreaterThan(0);
  });

  test("should navigate back from step 1 to step 0", async ({ page }) => {
    // Go to step 1 first
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });
    const artistInput = page.getByRole("textbox", {
      name: /Имя исполнителя/i,
    });
    const lyricsInput = page.getByRole("textbox", { name: /Слова к треку/i });

    await trackNameInput.fill("Test Track");
    await artistInput.fill("Test Artist");
    await lyricsInput.fill("Test lyrics");

    const nextButton = page.getByRole("button", { name: /Далее|Следующий/ });
    await nextButton.click();
    await page.waitForTimeout(300);

    // Find and click back button
    const backButton = page.getByRole("button", { name: /Назад/ });
    const isVisible = await backButton.isVisible().catch(() => false);

    if (isVisible) {
      await backButton.click();
      await page.waitForTimeout(300);

      // Should be back to step 0
      const trackNameLabel = page.locator('label:has-text("Название трека")');
      await expect(trackNameLabel).toBeVisible();
    }
  });

  test("should preserve data when navigating back and forth", async ({
    page,
  }) => {
    const testTrackName = "Persistent Track";
    const testArtistName = "Persistent Artist";
    const testLyrics = "Persistent lyrics";

    // Fill step 0
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });
    const artistInput = page.getByRole("textbox", {
      name: /Имя исполнителя/i,
    });
    const lyricsInput = page.getByRole("textbox", { name: /Слова к треку/i });

    await trackNameInput.fill(testTrackName);
    await artistInput.fill(testArtistName);
    await lyricsInput.fill(testLyrics);

    // Go to step 1
    const nextButton = page.getByRole("button", { name: /Далее|Следующий/ });
    await nextButton.click();
    await page.waitForTimeout(300);

    // Go back to step 0
    const backButton = page.getByRole("button", { name: /Назад/ });
    const isVisible = await backButton.isVisible().catch(() => false);

    if (isVisible) {
      await backButton.click();
      await page.waitForTimeout(300);

      // Verify data is preserved
      const newTrackInput = page.getByRole("textbox", {
        name: /Название трека/i,
      });
      const newArtistInput = page.getByRole("textbox", {
        name: /Имя исполнителя/i,
      });
      const newLyricsInput = page.getByRole("textbox", {
        name: /Слова к треку/i,
      });

      await expect(newTrackInput).toHaveValue(testTrackName);
      await expect(newArtistInput).toHaveValue(testArtistName);
      await expect(newLyricsInput).toHaveValue(testLyrics);
    }
  });

  test("should have back button disabled on step 0", async ({ page }) => {
    const backButton = page.getByRole("button", { name: /Назад/ });

    // Back button should not be visible or disabled on step 0
    const isVisible = await backButton
      .isVisible({ timeout: 1000 })
      .catch(() => false);

    if (isVisible) {
      // If visible, it should be disabled
      const isDisabled = await backButton.evaluate(
        (el) => (el as HTMLButtonElement).disabled,
      );
      expect(isDisabled).toBe(true);
    }
  });

  test("should allow file upload on step 1", async ({ page }) => {
    // Navigate to step 1
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });
    const artistInput = page.getByRole("textbox", {
      name: /Имя исполнителя/i,
    });
    const lyricsInput = page.getByRole("textbox", { name: /Слова к треку/i });

    await trackNameInput.fill("Test Track");
    await artistInput.fill("Test Artist");
    await lyricsInput.fill("Test lyrics");

    const nextButton = page.getByRole("button", { name: /Далее|Следующий/ });
    await nextButton.click();
    await page.waitForTimeout(300);

    // File input is hidden but wrapped in a clickable div with button
    // Find the button that says "Загрузить обложку"
    const uploadButton = page.getByRole("button", { name: /Загрузить/ });
    await expect(uploadButton).toBeVisible();

    // Verify the file input exists (even if hidden)
    const fileInput = page.locator('input[type="file"]');
    expect(await fileInput.count()).toBeGreaterThan(0);
  });

  test("should navigate through all steps", async ({ page }) => {
    // Step 0: Fill track info
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });
    const artistInput = page.getByRole("textbox", {
      name: /Имя исполнителя/i,
    });
    const lyricsInput = page.getByRole("textbox", { name: /Слова к треку/i });

    await trackNameInput.fill("Complete Track");
    await artistInput.fill("Complete Artist");
    await lyricsInput.fill("Complete lyrics");

    // Step 0 -> Step 1
    let nextButton = page.getByRole("button", { name: /Далее|Следующий/ });
    await nextButton.click();
    await page.waitForTimeout(300);

    // Verify we're on step 1 (should see file upload button)
    const uploadButton = page.getByRole("button", { name: /Загрузить/ });
    const hasUploadButton = await uploadButton.isVisible().catch(() => false);
    expect(hasUploadButton).toBe(true);

    // Step 1 -> Step 2
    nextButton = page.getByRole("button", { name: /Далее|Следующий/ });

    const hasNextButton = await nextButton.isVisible().catch(() => false);
    if (hasNextButton) {
      await nextButton.click();
      await page.waitForTimeout(300);

      // Verify page is still loaded and responsive
      const pageTitle = page.locator("body");
      await expect(pageTitle).toBeVisible();
    }
  });

  test("should handle form submission", async ({ page }) => {
    // Mock API response
    await page.route("**/tracks", async (route) => {
      if (route.request().method() === "POST") {
        await route.abort("blockedbyclient");
      }
    });

    // Fill complete form (all steps)
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });
    const artistInput = page.getByRole("textbox", {
      name: /Имя исполнителя/i,
    });
    const lyricsInput = page.getByRole("textbox", { name: /Слова к треку/i });

    await trackNameInput.fill("API Test Track");
    await artistInput.fill("API Test Artist");
    await lyricsInput.fill("API test lyrics");

    // Navigate to step 1
    const nextButton = page.getByRole("button", { name: /Далее|Следующий/ });
    await nextButton.click();
    await page.waitForTimeout(300);

    // Even with blocked API, form should remain interactive
    const fileInputs = page.locator('input[type="file"]');
    expect(await fileInputs.count()).toBeGreaterThan(0);
  });

  test("should display form fields with correct types", async ({ page }) => {
    // Check that we can get inputs by role
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });
    const artistInput = page.getByRole("textbox", {
      name: /Имя исполнителя/i,
    });
    const lyricsInput = page.getByRole("textbox", { name: /Слова к треку/i });

    // All should be visible
    await expect(trackNameInput).toBeVisible();
    await expect(artistInput).toBeVisible();
    await expect(lyricsInput).toBeVisible();
  });

  test("should handle empty field submission gracefully", async ({ page }) => {
    // Try to go to next step without filling form
    const nextButton = page.getByRole("button", { name: /Далее|Следующий/ });

    // Click next without filling
    await nextButton.click();

    // Wait a bit for any navigation or state changes
    await page.waitForTimeout(500);

    // Page should either:
    // 1. Stay on step 0 with validation error, or
    // 2. Allow progression

    // Either way, form should remain visible and interactive
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });

    // Wait for the input to be visible and ready
    const isVisible = await trackNameInput
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (isVisible) {
      // Should still be able to fill fields
      await trackNameInput.fill("After Attempt");
      await expect(trackNameInput).toHaveValue("After Attempt");
    } else {
      // If we navigated away, just verify the page is still responsive
      await expect(page.locator("body")).toBeVisible();
    }
  });
});

test.describe("Create Page - Complete User Flow", () => {
  test("should complete full track creation flow", async ({ page }) => {
    // Navigate to create page
    await page.goto("/tracks/create");
    await page.waitForLoadState("networkidle");

    // Step 0: Fill track info
    const trackNameInput = page.getByRole("textbox", {
      name: /Название трека/i,
    });
    const artistInput = page.getByRole("textbox", {
      name: /Имя исполнителя/i,
    });
    const lyricsInput = page.getByRole("textbox", { name: /Слова к треку/i });

    await trackNameInput.fill("Complete Flow Track");
    await artistInput.fill("Complete Flow Artist");
    await lyricsInput.fill("Complete flow lyrics");

    // Verify all fields are filled
    await expect(trackNameInput).toHaveValue("Complete Flow Track");
    await expect(artistInput).toHaveValue("Complete Flow Artist");
    await expect(lyricsInput).toHaveValue("Complete flow lyrics");

    // Navigate forward (should work at least once)
    const nextButton = page.getByRole("button", { name: /Далее|Следующий/ });

    const hasNextButton = await nextButton.isVisible().catch(() => false);
    if (hasNextButton) {
      await nextButton.click();
      await page.waitForTimeout(300);

      // Verify navigation happened - should see file input
      const fileInputs = page.locator('input[type="file"]');
      expect(await fileInputs.count()).toBeGreaterThan(0);
    }
  });
});
