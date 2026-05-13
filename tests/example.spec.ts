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

test.describe('Cart', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
  });

  test('should add item to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('should add multiple items to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('should remove item from cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  });

});

test.describe('Checkout', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
  });

  test('should proceed to checkout', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  });

  test('should complete checkout with valid info', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Thanh');
    await page.locator('[data-test="lastName"]').fill('Sang');
    await page.locator('[data-test="postalCode"]').fill('70000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
  });

  test('should show error when checkout info is empty', async ({ page }) => {
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

});