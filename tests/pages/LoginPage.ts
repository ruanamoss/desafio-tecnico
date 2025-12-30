import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async login(username: string, password: string) {
    if (!this.page.url().includes('index.htm')) {
      await this.goto('/index.htm');
    }
    await this.page.waitForLoadState('networkidle');
    const usernameInput = this.page.locator('input[name="username"]');
    const passwordInput = this.page.locator('input[name="password"]');
    const submitButton = this.page.locator('input[value="Log In"]');

    await usernameInput.fill(username);
    await passwordInput.fill(password);
    await submitButton.click();
  }

  async loginErrorMessage() {
    return this.page.locator('.error').innerText().catch(() => '');
  }
}
