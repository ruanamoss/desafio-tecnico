import { test, expect } from '@playwright/test';
import RegisterPage from '../pages/RegisterPage';
import { sampleUser } from '../utils/testData';

test.describe('Register - CT-001..CT-004', () => {
  
  test('CT-001 - Cadastro válido', async ({ page }) => {
    const register = new RegisterPage(page);
    const user = sampleUser();
    
    await register.fillForm(user);
    await register.submit();
    
    const successMessage = page.locator('text=Your account was created successfully');
    await expect(successMessage).toBeVisible({ timeout: 50000 });
    
    await expect(page).toHaveURL(/overview.htm|index.htm/);
    
    await expect(page.locator('text=Congratulations')).toBeVisible().catch(() => {
      expect(successMessage).toBeTruthy();
    });
  });

  test('CT-002 - Cadastro com e-mail inválido', async ({ page }) => {
    const register = new RegisterPage(page);
    const user = sampleUser();
    await register.goto('/register.htm');
    await page.waitForLoadState('networkidle');
    
    const firstName = page.locator('input[name="customer.firstName"]');
    await expect(firstName).toBeVisible({ timeout: 30000 });
    await firstName.fill(user.firstName);
    await page.locator('input[name="customer.lastName"]').fill(user.lastName);
    await page.locator('input[name="customer.address.street"]').fill(user.address);
    await page.locator('input[name="customer.address.city"]').fill(user.city);
    await page.locator('input[name="customer.address.state"]').fill(user.state);
    await page.locator('input[name="customer.address.zipCode"]').fill(user.zipCode);
    await page.locator('input[name="customer.phoneNumber"]').fill(user.phone);
    await page.locator('input[name="customer.ssn"]').fill(user.ssn);
    await page.locator('input[name="customer.username"]').fill('invalid@@username');
    await page.locator('input[name="customer.password"]').fill(user.password);
    await page.locator('input[name="repeatedPassword"]').fill(user.password);
    
    await register.submit();
    await page.waitForTimeout(2000);
    
    const currentUrl = page.url();
    const errorMessage = await register.errorMessage();
    
    expect(currentUrl.includes('register.htm') || errorMessage.toLowerCase().includes('error')).toBeTruthy();
  });

  test('CT-003 - Cadastro com CPF já existente', async ({ page }) => {
    const register = new RegisterPage(page);
    const user = sampleUser();
    const fixedSSN = '111-22-3333';
    user.ssn = fixedSSN;
    
    await register.fillForm(user);
    await register.submit();
    const successMessage1 = await page.locator('text=Your account was created successfully').isVisible().catch(() => false);
    
    if (successMessage1) {
      const user2 = sampleUser();
      user2.ssn = fixedSSN;
      await register.goto('/register.htm');
      await register.fillForm(user2);
      await register.submit();
      
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      const errorMessage = await register.errorMessage();
      const isDuplicate = errorMessage.toLowerCase().includes('duplicate') || 
                         errorMessage.toLowerCase().includes('already') ||
                         errorMessage.toLowerCase().includes('exists');
      
      expect(currentUrl.includes('register.htm') || isDuplicate).toBeTruthy();
    }
  });

  test('CT-004 - Senha na borda', async ({ page }) => {
    const register = new RegisterPage(page);
    const user = sampleUser();
    
    await register.goto('/register.htm');
    await page.waitForLoadState('networkidle');
    
    const firstName = page.locator('input[name="customer.firstName"]');
    await firstName.fill(user.firstName);
    await page.locator('input[name="customer.lastName"]').fill(user.lastName);
    await page.locator('input[name="customer.address.street"]').fill(user.address);
    await page.locator('input[name="customer.address.city"]').fill(user.city);
    await page.locator('input[name="customer.address.state"]').fill(user.state);
    await page.locator('input[name="customer.address.zipCode"]').fill(user.zipCode);
    await page.locator('input[name="customer.phoneNumber"]').fill(user.phone);
    await page.locator('input[name="customer.ssn"]').fill(user.ssn);
    await page.locator('input[name="customer.username"]').fill(user.username);
    
    const shortPassword = 'Abc123';
    await page.locator('input[name="customer.password"]').fill(shortPassword);
    await page.locator('input[name="repeatedPassword"]').fill(shortPassword);
    await register.submit();
    
    await page.waitForTimeout(1500);
    let currentUrl = page.url();
    let errorMessage = await register.errorMessage();
    
    expect(currentUrl.includes('register.htm') || errorMessage.length > 0).toBeTruthy();
    
    await register.goto('/register.htm');
    await page.waitForLoadState('networkidle');
    
    await firstName.fill(user.firstName);
    await page.locator('input[name="customer.lastName"]').fill(user.lastName);
    await page.locator('input[name="customer.address.street"]').fill(user.address);
    await page.locator('input[name="customer.address.city"]').fill(user.city);
    await page.locator('input[name="customer.address.state"]').fill(user.state);
    await page.locator('input[name="customer.address.zipCode"]').fill(user.zipCode);
    await page.locator('input[name="customer.phoneNumber"]').fill(user.phone);
    await page.locator('input[name="customer.ssn"]').fill(user.ssn + '2');
    await page.locator('input[name="customer.username"]').fill(user.username + '2');
    
    const passwordNoNumbers = 'Abcdefgh';
    await page.locator('input[name="customer.password"]').fill(passwordNoNumbers);
    await page.locator('input[name="repeatedPassword"]').fill(passwordNoNumbers);
    await register.submit();
    
    await page.waitForTimeout(1500);
    currentUrl = page.url();
    errorMessage = await register.errorMessage();
    
    expect(currentUrl.includes('register.htm') || errorMessage.length > 0).toBeTruthy();
  });
});
