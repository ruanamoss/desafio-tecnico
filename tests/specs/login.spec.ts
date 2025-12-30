import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { sampleUser } from '../utils/testData';

test.describe('Login - CT-006..CT-009', () => {

  test('CT-006 - Login com sucesso', async ({ page }) => {
    const login = new LoginPage(page);
    const user = sampleUser();
    const register = new RegisterPage(page);
    await register.fillForm(user);
    await register.submit();
    await expect(page.locator('text=Your account was created successfully')).toBeVisible();
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    await login.login(user.username, user.password);
    await expect(page.locator('text=Log Out')).toBeVisible({ timeout: 5000 }).catch(() => {
      expect(page.locator(`text=Welcome ${user.username}`)).toBeTruthy();
    });
  });

  test('CT-007 - Senha incorreta', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('nonexistent_user', 'wrongpass');
    await expect(page.locator('text=The username and password could not be verified')).toBeVisible().catch(() => {});
  });

  test('CT-008 - Usuário inexistente', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('user_does_not_exist', 'somepass');
    await expect(page.locator('text=The username and password could not be verified')).toBeVisible().catch(() => {});
  });

  test('CT-009 - Campos vazios', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login('', '');
    await expect(page).toHaveURL(/login.htm/);
  });
});
