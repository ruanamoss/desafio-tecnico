import { Page } from '@playwright/test';
import BasePage from './BasePage';

type User = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
};

export default class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async fillForm(user: User) {
    await this.goto('/register.htm');
    await this.page.waitForLoadState('networkidle');
    const firstName = this.page.locator('input[name="customer.firstName"]');
    await firstName.fill(user.firstName);
    await this.page.locator('input[name="customer.lastName"]').fill(user.lastName);
    await this.page.locator('input[name="customer.address.street"]').fill(user.address);
    await this.page.locator('input[name="customer.address.city"]').fill(user.city);
    await this.page.locator('input[name="customer.address.state"]').fill(user.state);
    await this.page.locator('input[name="customer.address.zipCode"]').fill(user.zipCode);
    await this.page.locator('input[name="customer.phoneNumber"]').fill(user.phone);
    await this.page.locator('input[name="customer.ssn"]').fill(user.ssn);
    await this.page.locator('input[name="customer.username"]').fill(user.username);
    await this.page.locator('input[name="customer.password"]').fill(user.password);
    await this.page.locator('input[name="repeatedPassword"]').fill(user.password);
  }

  async submit() {
    await this.page.click('input[value="Register"]');
  }

  async successMessageVisible() {
    return this.page.locator('text=Your account was created successfully').isVisible();
  }

  async errorMessage() {
    return this.page.locator('.error').innerText().catch(() => '');
  }
}
