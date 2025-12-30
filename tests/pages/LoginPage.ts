import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    // If not on login page, go to it
    if (!this.page.url().includes('index.htm')) {
      await this.goto('/index.htm');
    }
    await this.page.waitForLoadState('networkidle');
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[value="Log In"]');
  }

  async loginErrorMessage() {
    return this.page.locator('.error').innerText().catch(() => '');
  }
}
