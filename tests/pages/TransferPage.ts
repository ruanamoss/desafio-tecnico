import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class TransferPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.goto('/transfer.htm');
    await this.page.waitForLoadState('networkidle');
  }

  async transfer(fromAccount: string, toAccount: string, amount: string) {
    await this.open();
    await this.page.fill('input[name="amount"]', amount);
    await this.page.selectOption('select[name="fromAccountId"]', fromAccount);
    await this.page.selectOption('select[name="toAccountId"]', toAccount);
    await this.page.click('input[value="Transfer"]');
  }

  async getSuccessMessage() {
    return this.page.locator('div[ng-bind] , .title, #transactionForm .success').innerText().catch(() => '');
  }
}
