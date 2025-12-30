import { test, expect } from '@playwright/test';
import OpenAccountPage from '../pages/OpenAccountPage';
import AccountsPage from '../pages/AccountsPage';
import RegisterPage from '../pages/RegisterPage';
import { sampleUser } from '../utils/testData';

test.describe('Accounts - CT-010..CT-012', () => {
  test.setTimeout(60000);
  let user: any;
  test.beforeEach(async ({ page }) => {
    user = sampleUser();
    const register = new RegisterPage(page);
    await register.fillForm(user);
    await register.submit();
    await expect(page.locator('text=Your account was created successfully')).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('CT-010 - Abrir conta Savings', async ({ page }) => {
    const open = new OpenAccountPage(page);
    await open.openNewAccount('SAVINGS');
    const id = await open.getCreatedAccountId();
    expect(id).toBeTruthy();
  });

  test('CT-011 - Abrir conta Checking', async ({ page }) => {
    const open = new OpenAccountPage(page);
    await open.openNewAccount('CHECKING');
    const id = await open.getCreatedAccountId();
    expect(id).toBeTruthy();
  });

  test('CT-012 - Accounts Overview', async ({ page }) => {
    const accounts = new AccountsPage(page);
    await accounts.openOverview();
    const ids = await accounts.getAccountIds();
    expect(ids.length).toBeGreaterThanOrEqual(1);
  });
});
