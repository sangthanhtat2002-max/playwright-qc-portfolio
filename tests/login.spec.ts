import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../fixtures/testData';

test.describe('Login', () => {

    test('TC001 - should login successfully with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(
            testData.users.standard.username,
            testData.users.standard.password
        );
        await expect(page).toHaveURL(`${testData.baseUrl}/inventory.html`);
    });

    test('TC002 - should show error with wrong password', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(
            testData.users.standard.username,
            'wrong_password'
        );
        await expect(page.locator('[data-test="error"]')).toBeVisible();
    });

    test('TC003 - should show error with locked out user', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.login(
            testData.users.locked.username,
            testData.users.locked.password
        );
        const error = await loginPage.getErrorMessage();
        expect(error).toContain('locked out');
    });

});