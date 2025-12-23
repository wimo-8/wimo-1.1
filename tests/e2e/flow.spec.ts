import { test, expect } from '@playwright/test';

test('الصفحة الرئيسية تظهر شعار سوقIQ', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('سوقIQ')).toBeVisible();
});
