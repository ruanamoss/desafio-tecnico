import { test, expect } from '@playwright/test';
import OpenAccountPage from '../pages/OpenAccountPage';
import AccountsPage from '../pages/AccountsPage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import { sampleUser } from '../utils/testData';

test.describe('Accounts - CT-009..CT-011', () => {
  test.setTimeout(60000);
  let user: any;
  
  test.beforeEach(async ({ page }) => {
    user = sampleUser();
    const register = new RegisterPage(page);
    await register.fillForm(user);
    await register.submit();
    const successMessage = page.locator('text=Your account was created successfully');
    await expect(successMessage).toBeVisible({ timeout: 90000 });
  });

  test('CT-009 - Abertura de nova conta', async ({ page }) => {
    const open = new OpenAccountPage(page);
    await open.openNewAccount('SAVINGS');
    
    const id = await open.getCreatedAccountId();
    expect(id).toBeTruthy();
    expect(id).toMatch(/\d+/);
    
    const accounts = new AccountsPage(page);
    await accounts.openOverview();
    const ids = await accounts.getAccountIds();
    expect(ids.length).toBeGreaterThanOrEqual(1);
    expect(ids).toContain(id);
    
    const balances = await accounts.getAccountBalances();
    expect(balances.length).toBeGreaterThanOrEqual(1);
  });

  test('CT-010 - Visualização de contas', async ({ page }) => {
    const accounts = new AccountsPage(page);
    await accounts.openOverview();
    
    const ids = await accounts.getAccountIds();
    expect(ids.length).toBeGreaterThanOrEqual(1);
    
    const accountTable = page.locator('#accountTable');
    await expect.soft(accountTable).toBeVisible({ timeout: 30000 });
    
    const headers = await page.locator('#accountTable thead th').count();
    expect(headers).toBeGreaterThanOrEqual(3);
    
    const balances = await accounts.getAccountBalances();
    expect(balances.length).toBeGreaterThanOrEqual(1);
    
    balances.forEach(balance => {
      expect(balance).toMatch(/\$?[\d,]+\.\d{2}/);
    });
  });

  test('CT-011 - Criação de conta com dados inválidos', async ({ page }) => {
    const open = new OpenAccountPage(page);
    await open.goto('/openaccount.htm');
    const firstName = page.locator('input[name="customer.firstName"]');
    
    if (await firstName.isVisible().catch(() => false)) {
      const submitButton = page.locator('input[value="Open New Account"], button:has-text("Open New Account")');
      await submitButton.click().catch(() => {});
      
      const errorMessage = page.locator('.error, .message, [role="alert"]');
      await expect.soft(errorMessage).toBeVisible({ timeout: 5000 });
    } else {
      const accountTypeSelect = page.locator('select#type');
      const options = await accountTypeSelect.locator('option').count().catch(() => 0);
      
      expect(options).toBeGreaterThanOrEqual(1);
    }
  });
});
