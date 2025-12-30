import { Page } from '@playwright/test';
import BasePage from './BasePage';

export default class OpenAccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openNewAccount(accountType = 'SAVINGS') {
    await this.goto('/openaccount.htm');
    await this.page.waitForLoadState('networkidle');
    const typeSelect = this.page.locator('select#type');
    
    const options = await typeSelect.locator('option').allTextContents();
    if (options.includes(accountType)) {
      await typeSelect.selectOption({ label: accountType });
    } else if (options.length > 0) {
      await typeSelect.selectOption({ index: 0 });
    }

    const fromSelect = this.page.locator('select#fromAccountId');
    const firstOption = await fromSelect.locator('option').first().getAttribute('value');
    if (firstOption) await fromSelect.selectOption(firstOption);

    await this.page.locator('input[value="Open New Account"]').click();
  }

  async getCreatedAccountId() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    
    // Tentar #newAccountId
    const newAccountId = this.page.locator('#newAccountId');
    if (await newAccountId.count() > 0) {
      const text = await newAccountId.innerText().catch(() => '');
      if (text) return text.trim();
    }
    
    // Tentar pelo link com id no href
    const accountLink = this.page.locator('a[href*="activity.htm?id="]');
    if (await accountLink.count() > 0) {
      const text = await accountLink.first().innerText().catch(() => '');
      if (text && /\d+/.test(text)) return text.trim();
      
      const href = await accountLink.first().getAttribute('href');
      const match = href?.match(/id=(\d+)/);
      if (match) return match[1];
    }
    
    // Tentar qualquer texto que pareça um ID de conta
    const allText = await this.page.content();
    const accountMatch = allText.match(/Account Number[:\s]+(\d+)/i) || 
                        allText.match(/New Account[:\s]+(\d+)/i) ||
                        allText.match(/#(\d{5,})/);
    if (accountMatch) return accountMatch[1];
    
    return '';
  }
}
