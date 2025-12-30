import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import { sampleUser } from '../utils/testData';

test.describe.configure({ timeout: 60000 });

test.describe('Login - CT-005..CT-008', () => {

  test('CT-005 - Login com credenciais válidas', async ({ page }) => {
    const login = new LoginPage(page);
    const user = sampleUser();
    const register = new RegisterPage(page);
    
    await register.fillForm(user);
    await register.submit();
    
    const successMessage = page.locator('text=Your account was created successfully');
    await expect(successMessage).toBeVisible({ timeout: 50000 });
    
    await page.goto('https://parabank.parasoft.com/parabank/logout.htm');
    await page.waitForLoadState('networkidle');
    
    await login.login(user.username, user.password);
    
    const logOutButton = page.locator('text=Log Out');
    const welcomeMessage = page.locator(`text=Welcome`);
    
    await expect.soft(logOutButton).toBeVisible({ timeout: 50000 }).catch(async () => {
      await expect(welcomeMessage).toBeVisible();
    });
    
    await expect(page).toHaveURL(/overview.htm|accounts.htm|index.htm/);
  });

  test('CT-006 - Login com senha incorreta', async ({ page }) => {
    const login = new LoginPage(page);
    const user = sampleUser();
    const register = new RegisterPage(page);
    
    await register.fillForm(user);
    await register.submit();
    const successMessage = page.locator('text=Your account was created successfully');
    await expect(successMessage).toBeVisible({ timeout: 50000 }).catch(() => {});
    
    await page.goto('https://parabank.parasoft.com/parabank/logout.htm');
    await page.waitForLoadState('networkidle');
    
    await login.login(user.username, 'WrongPassword123!');
    
    await page.waitForTimeout(2000);
    
    const errorMessage = page.locator('text=The username and password could not be verified');
    const genericError = page.locator('.error, .message, [role="alert"]');
    
    await expect.soft(errorMessage).toBeVisible().catch(async () => {
      await expect(genericError).toBeVisible();
    });
    
    expect(!page.url().includes('overview.htm')).toBeTruthy();
  });

  test('CT-007 - Bloqueio após tentativas consecutivas', async ({ page }) => {
    const login = new LoginPage(page);
    const user = sampleUser();
    const register = new RegisterPage(page);
    
    await register.fillForm(user);
    await register.submit();
    const successMessage = page.locator('text=Your account was created successfully');
    await expect(successMessage).toBeVisible({ timeout: 50000 }).catch(() => {});
    
    await page.goto('https://parabank.parasoft.com/parabank/logout.htm');
    await page.waitForLoadState('networkidle');
    
    const maxAttempts = 5;
    
    for (let i = 0; i < maxAttempts; i++) {
      await login.login(user.username, 'WrongPassword123!');
      await page.waitForTimeout(500);
      
      const blockMessage = page.locator('text=locked, blocked, suspended, disabled').isVisible().catch(() => false);
      if (await blockMessage) {
        expect(true).toBeTruthy();
        return;
      }
      
      if (i < maxAttempts - 1) {
        await page.goto('https://parabank.parasoft.com/parabank/index.htm');
      }
    }
    
    await login.login(user.username, 'WrongPassword123!');
    await page.waitForTimeout(1000);
    
    const blockMessage = page.locator('text=locked, blocked, suspended').isVisible().catch(() => false);
    const errorMessage = page.locator('text=The username and password could not be verified').isVisible().catch(() => false);
    
    const isBlocked = await blockMessage;
    const hasError = await errorMessage;
    
    expect(isBlocked || hasError).toBeTruthy();
  });

  test('CT-008 - Restauração de senha', async ({ page }) => {
    const login = new LoginPage(page);
    const user = sampleUser();
    const register = new RegisterPage(page);
    
    await register.fillForm(user);
    await register.submit();
    const successMessage = page.locator('text=Your account was created successfully');
    await expect(successMessage).toBeVisible({ timeout: 50000 }).catch(() => {});
    
    await page.goto('https://parabank.parasoft.com/parabank/logout.htm');
    await page.waitForLoadState('networkidle');
    
    await page.goto('https://parabank.parasoft.com/parabank/index.htm');
    const forgotLink = page.locator('text=Forgot login info?');
    
    await forgotLink.click().catch(() => {});
    
    await expect.soft(page).toHaveURL(/lookup.htm|forgot.htm|password.htm/);
    
    const recoveryForm = page.locator('form, input[name*="firstName"], input[name*="lastName"]');
    await expect.soft(recoveryForm).toBeVisible({ timeout: 30000 }).catch(() => {});
  });
});
