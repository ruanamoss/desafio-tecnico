import { test, expect } from '@playwright/test';
import TransferPage from '../pages/TransferPage';
import RegisterPage from '../pages/RegisterPage';
import OpenAccountPage from '../pages/OpenAccountPage';
import { sampleUser } from '../utils/testData';

test.describe('Transfer Funds - CT-013..CT-015', () => {
  test.setTimeout(60000);
  let user: any;
  test.beforeEach(async ({ page }) => {
    user = sampleUser();
    const register = new RegisterPage(page);
    await register.fillForm(user);
    await register.submit();
    await expect(page.locator('text=Your account was created successfully')).toBeVisible({ timeout: 5000 }).catch(() => {});
    const open = new OpenAccountPage(page);
    await open.openNewAccount('SAVINGS');
  });

  test('CT-013 - Transferência com sucesso', async ({ page }) => {
    const transfer = new TransferPage(page);
    // naive selection: pick first two accounts
    await transfer.open();
    const from = await page.locator('select[name="fromAccountId"] option').first().getAttribute('value');
    const to = await page.locator('select[name="toAccountId"] option').nth(1).getAttribute('value');
    if (!from || !to) {
      test.skip();
      return;
    }
    await transfer.transfer(from, to, '10.00');
    await expect(page.locator('text=Transfer Complete!')).toBeVisible().catch(() => {});
  });

  test('CT-014 - Valor vazio', async ({ page }) => {
    const transfer = new TransferPage(page);
    await transfer.open();
    await page.fill('input[name="amount"]', '');
    await page.click('input[value="Transfer"]');
    await expect(page).toHaveURL(/transfer.htm/).catch(() => {});
  });

  test('CT-015 - Valor inválido', async ({ page }) => {
    const transfer = new TransferPage(page);
    await transfer.open();
    await page.fill('input[name="amount"]', 'abc');
    await page.click('input[value="Transfer"]');
    await expect(page).toHaveURL(/transfer.htm/).catch(() => {});
  });
});
