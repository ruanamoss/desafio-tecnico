import { Page } from '@playwright/test';

export default class BasePage {
  readonly page: Page;
  readonly baseURL = 'https://parabank.parasoft.com/parabank';

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(this.baseURL + path);
  }
}
