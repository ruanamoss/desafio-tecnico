import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class AccountsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openOverview() {
    await this.goto('/overview.htm');
    await this.page.waitForLoadState('networkidle');
  }

  async getAccountIds() {
    await this.page.waitForSelector('table#accountTable tbody tr', { timeout: 10000 }).catch(() => {});
    const rows = this.page.locator('table#accountTable tbody tr');
    const ids: string[] = [];
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const idText = await rows.nth(i).locator('td a').first().innerText().catch(() => '');
      if (idText) ids.push(idText.trim());
    }
    return ids;
  }

  async getAccountBalances() {
    const rows = this.page.locator('table#accountTable tbody tr');
    const balances: string[] = [];
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      // Geralmente a coluna de saldo é a segunda ou terceira coluna
      const balance = await rows.nth(i).locator('td').nth(1).innerText().catch(() => 
        rows.nth(i).locator('td').nth(2).innerText()
      );
      balances.push(balance.trim());
    }
    return balances;
  }

  async getAccountTypes() {
    const rows = this.page.locator('table#accountTable tbody tr');
    const types: string[] = [];
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      // Obter o tipo de conta (geralmente segunda coluna)
      const type = await rows.nth(i).locator('td').nth(1).innerText();
      types.push(type.trim());
    }
    return types;
  }

  async verifyAccountExists(accountId: string) {
    const ids = await this.getAccountIds();
    return ids.includes(accountId);
  }
}

