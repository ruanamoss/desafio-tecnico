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
    const rows = this.page.locator('table#accountTable tbody tr');
    const ids: string[] = [];
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const id = await rows.nth(i).locator('td a').first().innerText();
      ids.push(id.trim());
    }
    return ids;
  }
}
