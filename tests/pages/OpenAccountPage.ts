import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class OpenAccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openNewAccount(accountType = 'SAVINGS') {
    await this.goto('/openaccount.htm');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('select[id="type"]', { state: 'visible', timeout: 15000 });
    await this.page.selectOption('select[id="type"]', { value: accountType });
    const fromSelect = this.page.locator('select[id="fromAccountId"]');
    const firstOption = await fromSelect.locator('option').first().getAttribute('value');
    if (firstOption) await this.page.selectOption('select[id="fromAccountId"]', firstOption);
    await this.page.click('input[value="Open New Account"]');
  }

  async getCreatedAccountId() {
    const locator = this.page.locator('a.accountId, #newAccountId');
    if (await locator.count() > 0) return await locator.first().innerText();
    // fallback: look for link with account id pattern
    const link = this.page.locator('a').filter({ hasText: '' });
    return (await link.first().innerText()) || '';
  }
}
