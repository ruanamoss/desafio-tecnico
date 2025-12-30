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
    await this.page.fill('input[name="customer.firstName"]', user.firstName);
    await this.page.fill('input[name="customer.lastName"]', user.lastName);
    await this.page.fill('input[name="customer.address.street"]', user.address);
    await this.page.fill('input[name="customer.address.city"]', user.city);
    await this.page.fill('input[name="customer.address.state"]', user.state);
    await this.page.fill('input[name="customer.address.zipCode"]', user.zipCode);
    await this.page.fill('input[name="customer.phoneNumber"]', user.phone);
    await this.page.fill('input[name="customer.ssn"]', user.ssn);
    await this.page.fill('input[name="customer.username"]', user.username);
    await this.page.fill('input[name="customer.password"]', user.password);
    await this.page.fill('input[name="repeatedPassword"]', user.password);
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
