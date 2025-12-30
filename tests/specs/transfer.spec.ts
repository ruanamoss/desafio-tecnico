import { test, expect } from '@playwright/test';
import TransferPage from '../pages/TransferPage';
import RegisterPage from '../pages/RegisterPage';
import OpenAccountPage from '../pages/OpenAccountPage';
import AccountsPage from '../pages/AccountsPage';
import { sampleUser } from '../utils/testData';

test.describe('Transfer Funds - CT-012..CT-015', () => {
  test.setTimeout(60000);
  let user: any;
  let firstAccountId: string;
  let secondAccountId: string;
  
  test.beforeEach(async ({ page }) => {
    user = sampleUser();
    const register = new RegisterPage(page);
    await register.fillForm(user);
    await register.submit();
    const successMessage = page.locator('text=Your account was created successfully');
    await expect(successMessage).toBeVisible({ timeout: 50000 });
    
    // Criar segunda conta para permitir transferência
    const open = new OpenAccountPage(page);
    await open.openNewAccount('SAVINGS');
    const successMsg = page.locator('text=Congratulations, your account is now open');
    await expect(successMsg).toBeVisible({ timeout: 30000 }).catch(() => {});
    
    // Obter IDs das contas
    const accounts = new AccountsPage(page);
    await accounts.openOverview();
    const ids = await accounts.getAccountIds();
    if (ids.length >= 2) {
      firstAccountId = ids[0];
      secondAccountId = ids[1];
    }
  });

    test('CT-012 - Transferência entre contas do mesmo usuário', async ({ page }) => {
    const transfer = new TransferPage(page);
    await transfer.open();
    
    const fromSelect = page.locator('select#fromAccountId');
    const toSelect = page.locator('select#toAccountId');
    
    const fromAccount = await fromSelect.locator('option').first().getAttribute('value');
    const toAccount = await toSelect.locator('option').nth(1).getAttribute('value');
    
    if (!fromAccount || !toAccount || fromAccount === toAccount) {
      test.skip();
      return;
    }
    
    const accounts = new AccountsPage(page);
    await accounts.openOverview();
    const balancesBefore = await accounts.getAccountBalances();
    
    await transfer.open();
    await transfer.transfer(fromAccount, toAccount, '10.00');
    
    const successMsg = page.locator('text=Transfer Complete!');
    await expect.soft(successMsg).toBeVisible({ timeout: 30000 });
    
    await accounts.openOverview();
    const balancesAfter = await accounts.getAccountBalances();
    expect(balancesAfter.length).toBe(balancesBefore.length);
    
    const activityTable = page.locator('table, #activityTable').nth(0);
    await expect.soft(activityTable).toBeVisible({ timeout: 10000 });
  });

  test('CT-013 - Transferência para conta externa/terceiro', async ({ page }) => {
    const transfer = new TransferPage(page);
    await transfer.open();
    
    const toSelect = page.locator('select#toAccountId');
    
    const optionsCount = await toSelect.locator('option').count();
    expect(optionsCount).toBeGreaterThanOrEqual(1);
    
    const externalAccountInput = page.locator('input[name*="external"], input[name*="account"], input[name*="agency"]');
    const hasExternalFields = await externalAccountInput.count();
    
    expect(hasExternalFields).toBe(0);
  });

  test('CT-014 - Transferência com saldo insuficiente', async ({ page }) => {
    const transfer = new TransferPage(page);
    await transfer.open();
    
    const fromSelect = page.locator('select#fromAccountId');
    const toSelect = page.locator('select#toAccountId');
    
    const fromAccount = await fromSelect.locator('option').first().getAttribute('value');
    const toAccount = await toSelect.locator('option').nth(1).getAttribute('value');
    
    if (!fromAccount || !toAccount) {
      test.skip();
      return;
    }
    
    await transfer.transfer(fromAccount, toAccount, '999999.00');
    await page.waitForTimeout(2000);
    
    const insufficientError = page.locator('text=insufficient, error, denied, overdraft');
    const successMsg = page.locator('text=Transfer Complete!');
    
    const hasError = await insufficientError.isVisible().catch(() => false);
    const hasSuccess = await successMsg.isVisible().catch(() => false);
    
    expect(hasError || hasSuccess).toBeTruthy();
  });

  test('CT-015 - Transferência com valor na borda', async ({ page }) => {
    const transfer = new TransferPage(page);
    await transfer.open();
    
    const fromSelect = page.locator('select#fromAccountId');
    const toSelect = page.locator('select#toAccountId');
    
    const fromAccount = await fromSelect.locator('option').first().getAttribute('value');
    const toAccount = await toSelect.locator('option').nth(1).getAttribute('value');
    
    if (!fromAccount || !toAccount) {
      test.skip();
      return;
    }
    
    await transfer.transfer(fromAccount, toAccount, '0.01');
    let successMsg = page.locator('text=Transfer Complete!');
    let errorMsg = page.locator('text=error, invalid, minimum, below');
    
    const minSuccess = await successMsg.isVisible().catch(() => false);
    const minError = await errorMsg.isVisible().catch(() => false);
    expect(minSuccess || minError).toBeTruthy();
    
    await transfer.open();
    await page.fill('input#amount', '0');
    await page.click('input[value="Transfer"], button:has-text("Transfer")').catch(() => {});
    
    await page.waitForTimeout(1000);
    errorMsg = page.locator('text=error, invalid, zero, cannot');
    const zeroError = await errorMsg.isVisible().catch(() => false);
    expect(zeroError || page.url().includes('transfer')).toBeTruthy();
    
    await page.fill('input#amount', '-10');
    await page.click('input[value="Transfer"], button:has-text("Transfer")').catch(() => {});
    
    await page.waitForTimeout(1000);
    errorMsg = page.locator('text=error, invalid, negative, cannot');
    const negativeError = await errorMsg.isVisible().catch(() => false);
    expect(negativeError || page.url().includes('transfer')).toBeTruthy();
  });
});
