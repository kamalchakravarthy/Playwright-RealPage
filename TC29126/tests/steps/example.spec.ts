import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {

  //await page.pause();
  await page.goto('https://realpageepm-test-realpageocifusion.epm.us-phoenix-1.ocs.oraclecloud.com/epmcloud');
  await page.getByPlaceholder('User name or email').fill('svc-EPM-FCCS_Automation');
  await page.locator('//input[@placeholder="Password"]').fill('FaCTAutomation@2024');
  await page.getByRole('button', {name:'Sign In'}).click();

  await page.locator('//a[@id="efsGlobalNavPopupDrawer"]').click();
  await page.getByText('Rules').first().click();
  await page.locator('(//img[@alt="Launch"])[2]').click();
  await page.locator("//button[@accesskey='L']").click();



});


