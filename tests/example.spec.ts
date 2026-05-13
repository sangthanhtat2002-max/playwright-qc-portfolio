import { test, expect } from '@playwright/test';

test.describe('Login', () => {

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });

  test('should show error with wrong password', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('should show error with locked out user', async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('locked_out_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

});

test.describe('Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('should display inventory page after login', async ({ page }) => {
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('should sort products by name Z to A', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('za');
    const firstItem = await page.locator('.inventory_item_name').first().textContent();
    expect(firstItem).toBe('Test.allTheThings() T-Shirt (Red)');
  });

  test('should sort products by price low to high', async ({ page }) => {
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
    const firstPrice = await page.locator('.inventory_item_price').first().textContent();
    expect(firstPrice).toBe('$7.99');
  });

});