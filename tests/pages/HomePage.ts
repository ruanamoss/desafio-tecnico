import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openRegister() {
    await this.goto('/register.htm');
  }

  async login(username: string, password: string) {
    await this.goto('/index.htm');
    await this.page.fill('input[name="username"]', username);
    await this.page.fill('input[name="password"]', password);
    await this.page.click('input[value="Log In"]');
  }
}
