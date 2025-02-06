import { DataTable, Given, Then, When } from "@cucumber/cucumber";
import { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout, ITestCaseHookParameter } from "@cucumber/cucumber";
import { fixture } from "../../hooks/pageFixture";
import { receivablesPage } from "../../hooks/hooks";
import otc_ReceivablesPage from '../../pages/FaCT/otc_ReceivablesPage';
import Assert from "../../helper/wrapper/assert";
import { assert } from "../../hooks/hooks";
import { faker } from "@faker-js/faker/locale/en";
import { expect, type Locator } from "@playwright/test";
import { fi, FinanceModule, tr } from "@faker-js/faker/.";
import { TIMEOUT } from "dns";
import { options } from "../../helper/util/logger";

let transactionNumber;
let transactionAmount;
let transactionDetails;
let randomNumber;
let mailId;
var id;
let approvalNumber;
let notification
let disputeId
let transactionId;
let adjustmentNum;
let strategyNum;
let receiptNumber;
let receiptAmount;
let receiptDetails;
 


Given(
  "I login to the Fusion application with {string} Persona",{ timeout: 80000 },
  async function (username: string) {
    await receivablesPage.signInToFusion(username)
  }
);

When('I click on the {string} option in the Navigator', async (option: string) => {
  await fixture.page.getByLabel("Navigator").click({ timeout: 20000 })
  await fixture.page.getByTitle(option, { exact: true }).click();
})

When('I click on {string} from the {string} Dropdown in the Navigator', async (option: string, dropdown: string) => {
  await fixture.page.getByRole('link', { name: option }).click();
  await fixture.page.waitForTimeout(5000)
})

When('I navigate to the {string} page under the {string} section in the Navigator', async (page: string, section: string) => {
  await fixture.page.getByRole("link",{name:"Navigator",exact:true}).click({ timeout: 20000 })
  
  const locator = fixture.page.getByRole('link', { name: page })
  if (!(await locator.isVisible())) {
    await fixture.page.getByTitle(section, { exact: true }).click({ timeout: 20000 });
  }
  await locator.click({ timeout: 20000 });
  await fixture.page.waitForTimeout(5000)
})

When('I logout from the Fusion Application', async () => {
  receivablesPage.signOutFromFusion()
})

When('I select the {string} from the search results', async (option: string) => {
  await fixture.page.locator("//select[@title='Customer by Name']").click()


})

When('I click on the {string} in the hierarchy region', async function (option: string) {
  await fixture.page.fill("//input[@aria-label='Search Text']", 'jmg');
  await fixture.page.locator("//img[@title='Search']").click();
  await fixture.page.getByText("JMG REALTY LLC").click();

})

When('I select the business level as {string} from the {string} tab', async (businesslevel: string, tab: string) => {
  await receivablesPage.clickOnTab(tab)
  await fixture.page.selectOption("//select[@class='x2h']", businesslevel);
  await fixture.page.waitForTimeout(5000)
})

When('I click on the {string} tab', async (tab: string) => {
  await receivablesPage.clickOnTab(tab)
})

When('I click on the plus sign in the contact tab', async () => {
  await fixture.page.getByRole("button", { name: "Create Contact" }).first().click()
})

When('I enter the contact details', async function () {
  await fixture.page.locator('(//input[@class="x25"])[1]').fill("jmg");
  await fixture.page.locator('(//input[@class="x25"])[2]').fill("llc");
  await fixture.page.selectOption("(//select[@class='x2h'])[4]", 'Billings');

})
When('I click on the plus sign in the contact responsibilities sub-region', async () => {
  await fixture.page.locator("(//img[@title='Add Row'])[3]").click();
})

When('I select {string} from the LOV and I select {string} and choose {string} and click {string}', async (lovValue: string, dropdown: string, dValue: string, button: string) => {
  await receivablesPage.setContactResponsibilities(lovValue, dropdown, dValue, button)
})

When('I click on the plus sign to add the email {string}', async (emailId: string) => {
  mailId = emailId
  await fixture.page.locator("(//img[@title='Add Row'])[2]").click()
  await fixture.page.locator("//input[@aria-label='Email']").fill(emailId);
})


When('I click on the {string} button', async (button: string) => {
  await receivablesPage.clickOnButton(button)
})

When('I create a transaction with the following details:', async (data: DataTable) => {
  transactionDetails = await receivablesPage.createTransaction(data)
  transactionNumber =transactionDetails[0]
  transactionAmount =transactionDetails[1]
})

When('I click on the {string} from the Task Panel', async (option: string) => {
  await fixture.page.locator("//img[@title='Tasks']").click();
  await fixture.page.getByRole('link', { name: option,exact:true }).click();

})

Then('I should see {string} Page', async (title: string) => {
  expect(await fixture.page.locator(`//div[contains(@title, "${title}")]`).isVisible({ timeout: 60000 }))
})

When('I enter the {string} in the Transaction Number input box', async (number: string) => {
  await fixture.page.locator("//input[@aria-label = ' Transaction Number']").click()
  await fixture.page.locator("//input[@aria-label = ' Transaction Number']").fill(transactionNumber)
  await fixture.page.waitForTimeout(3000)
})

When('I click on Search button', async () => {
  await fixture.page.locator("//button[contains(text(),'Search')]").click()
  await fixture.page.waitForTimeout(3000)
})

Then('I should see the searched transaction', async () => {
  expect(await fixture.page.locator(`//a[contains(text(),"${transactionNumber}")]`).isVisible({ timeout: 60000 }))
})

When('I click on {string} from the {string} Dropdown', async (option: string, dropdown: string) => {
  await fixture.page.locator(`//a[contains(text(),"${dropdown}")]`).click()
  await fixture.page.locator(`//td[contains(text(),"${option}")]`).click()
})

When('I change the {string} Value for Duplicate Transaction', async (s: string) => {
  randomNumber = faker.number.int({ min: 1, max: 10000 });
  await fixture.page.locator("(//input[contains(@id, 'Price')])[1]").fill(String(randomNumber))

})

When('I click on {string} button', async (option: string) => {

  await fixture.page.locator(`//a//span[contains(text(), "${option}")]`).click()
  await fixture.page.waitForTimeout(6000)
  await fixture.page.waitForLoadState();
})

When('I click on {string} from the {string} Dropdown in Edit Transaction Page', async (option: string, dropdown: string) => {

  await fixture.page.waitForTimeout(6000)
  await fixture.page.locator(`//a[@title = "${dropdown}"]`).click()
  await fixture.page.locator(`//td[contains(text() ,"${option}")]`).click()
})

Then('I click on {string} Button in the popup', async (option: string) => {
  await fixture.page.getByRole("button", { name: option }).click({ timeout: 60000 });
})

When('I click on {string} icon', async function (option: string) {
  await fixture.page.getByRole('link', { name: option }).click();

})

When('I click on {string} link in the Task panel', async function (option: string) {
  await fixture.page.getByRole('link', { name: option }).click();
})


When('I search for {string} and click on search', async function (organizationName) {
  await receivablesPage.selectOrganization(organizationName);

})

When('I select the {string} in search page', async function (option: string) {
  await fixture.page.getByRole('table', { name: 'PMC' })
    .getByRole('link', { name: option }).click();
    

})


When('I click on {string} tab in account profile', async function (option: string) {
  await fixture.page.getByRole('link', { name: option }).click();
})

Then('I should see {string} section', async function (heading: string) {
  expect(await fixture.page.getByRole('heading', { name: heading })).toBeVisible({ timeout: 20000 })

})

When('I click on Actions dropdown in profile history and select {string}', async function (option: string) {

  await fixture.page.getByRole('menuitem', { name: 'Actions' }).locator('div').click();
  await fixture.page.getByRole("cell", { name: option, exact: true })
    .click();
})

Then('I should see Account profile section', async function () {
  expect(await fixture.page.getByRole('heading', { name: 'Account Profile' })).toBeVisible()

})


Then('I review {string} in Credit and Collections', async function (option: string) {
  await receivablesPage.reviewComboBoxOptions(option);
});

Then('I ensure {string} is selected in Credit and Collections', async function (checkboxName: string) {
  await receivablesPage.reviewCheckBoxOption(checkboxName);
});

Then('I click on {string} in overview page', async (option: string) => {
  await fixture.page.getByRole("button", { name: option }).click({ timeout: 60000 });
})

Then('I click on {string} button in receivables', async (option: string) => {
  await fixture.page.locator(`//button[text()="${option}"]`).first().click();
});

Then('I click on the Submit button in process details page', async () => {
  await fixture.page.locator('//a[@role="button" and .//span[contains(text(), "Sub")]]').first().click()
});

Then('I click on {string} button in confirmation popup', async (option: string) => {
  await fixture.page.getByRole('button', { name: option }).click();
  const text = await fixture.page.locator(`//span[label[contains(text(), 'submitted')]]`).textContent();
  const arr = text.split(" ");
  id = arr[1];
  console.log(id);
});

When('I search {string} in process details page',{timeout:500000}, async(option: string) => {
  await receivablesPage.searchAndSelectName(option);
});
When('I click on {string} button in the schedule process selection popup', async function (option:string) {
  await fixture.page.locator("(//td[@class='x1pn']//button[text()='" +option+ "'])[1]").click();
});
Then('I should see the {string} page', async function (processDetailsHeader:string) {
  await fixture.page.getByRole('cell', { name: processDetailsHeader, exact: true }).getByText('Process Details').waitFor({timeout:20000});
  assert.assertTrue(await fixture.page.getByRole('cell', { name: processDetailsHeader, exact: true }).getByText('Process Details').isVisible());
});
When('I enter below fields and click on Submit', async function (data:DataTable) 
{
  await receivablesPage.enterTheScheduleProcessDetailsInTheProcessDetailsPage(data);
});
Then ('I should see the schedule process submitted with process ID', async function()
{
  await fixture.page.locator("//div[text()='Confirmation']").waitFor({timeout:20000});
  assert.assertTrue(await fixture.page.locator("//div[text()='Confirmation']").isVisible());
  await fixture.page.locator("//button[@_afrpdo='ok']").first().click();
});
When('I search for {string} in process details page', async (option: string) => {

  await receivablesPage.searchingProcessDetails(option);
})
When('I create a debit memo transaction with the following details:', async (data: DataTable) => {
  await receivablesPage.createDebitMemo(data)
})

When('I search for the {string} in process details page', async(option: string) => {
  await receivablesPage.searchingProcessDetails(option);
})

When('I select the business unit as {string} and mode as {string}', async function (string, string2) {
  await fixture.page.getByRole('combobox', { name: 'Business Unit' }).selectOption({label: `${string}`})
  await fixture.page.getByRole('combobox', { name: 'Mode' }).selectOption({label: `${string2}`});
});

Then('I should see the popup saying {string}', async function (string) {

  const sentence = await fixture.page.locator("//label[contains(text(),'was submitted.')]").textContent();
  const regex = /^Process \d+ was submitted\.$/;
  const match = regex.test(sentence);
  
  console.log(match);
  if (match) {
      console.log("The sentence matches the pattern.");
  } else {
      console.log("The sentence does not match the pattern.");
  }
});

When('I search with Transaction Number and complete as Yes', async function () {
  await fixture.page.getByRole('button', { name: 'Advanced' }).click({timeout:20000});
  await fixture.page.waitForTimeout(5000)
  await fixture.page.getByLabel('Transaction Number', { exact: true }).fill('I2',{timeout:20000});
  await fixture.page.getByRole('combobox', { name: 'Complete' }).selectOption('2',{timeout:20000});
  await fixture.page.getByRole('button', { name: 'Search', exact: true }).click({timeout:20000});
  await fixture.page.waitForTimeout(5000)
  
});


When('I click on Manage Adjustments option in the Actions menu', async function () {
  await fixture.page.locator("//a[text()='Actions']").click({timeout:60000});
  await fixture.page.getByRole('cell', { name: 'Manage Adjustments', exact: true }).click({timeout:60000});
});

When('I enter Receivables Activity as {string} and Adjustment Type as {string} and Adjustment Amount as {string}', async function (receivablesActivity:string, adjustmentType:string, adjustmentAmount:string) {       
  await receivablesPage.fillingDetailsInCreateAdjustmentWindow(receivablesActivity, adjustmentType, adjustmentAmount);
});

When('I click on the {string} button in the create adjustment window', async function (string) {
  await fixture.page.locator("//button[@title='Save']").dblclick({timeout:60000});
  await new Promise((resolve) => setTimeout(resolve, 10000));
  
});

Then('I should see the message saying {string}', async function (message:string) {
  console.log(message);
  const sentence = await fixture.page.locator("//div[contains(text(),'has been created.')]").textContent();
  const regex = /^The adjustment \d+ has been created\.$/;
  const match = regex.test(sentence);

  console.log(match);
  if (match) {
      console.log("The sentence matches the pattern.");
  } else {
      console.log("The sentence does not match the pattern.");
  }
});
When('I save and close the transaction', async () => {
  await receivablesPage.saveAndCloseTransaction();
})

Then('the transaction should be created successfully', async () => {
  await receivablesPage.assertTransactionCreation();
})

When('I choose {string} option from the search filter', async (option: string) => {
  await fixture.page.locator('select').selectOption(option);
})

When('I search for the customer {string}', async function (customer: string) {
  await fixture.page.fill("//input[@aria-label='Search Text']", customer);
  await fixture.page.locator("//img[@title='Search']").click();

  await fixture.page.waitForTimeout(2000)

  const searchResult = fixture.page.getByRole('link', { name: customer, exact: true }).last();
  if (await searchResult.isVisible()) {
    await searchResult.click()
    await fixture.page.waitForTimeout(2000)
  }
})

When('I select the business level field as {string}', async (businesslevel: string) => {
await fixture.page.getByRole('combobox', {name: 'Business Level'}).selectOption(businesslevel);
})

When('I enter the following contact details:', async function (dataTable: DataTable) {
  await receivablesPage.fillContactDetailsOfCustomerContact(dataTable)
})

When('I select {string} from the Responsibility LOV', async (option: string) => {
  await fixture.page.locator('(//select)[6]').selectOption(option)
  

})

When('I select {string} from the Actions dropdown', async (action: string) => {
  await fixture.page.getByRole('row', { name: 'Actions View', exact: true }).getByRole('link', { name: 'Actions' }).click()
  await fixture.page.getByRole('cell', { name: action, exact: true }).click()
})

Then('the customer mail details should be updated successfully', async () => {
  await receivablesPage.assertUpdationOfCustomerMailDetails(mailId)
})

Then('the customer contact details should be updated successfully', async() => {
  await receivablesPage.assertUpdationOfCustomerContactDetails();
})

When('I click on the tasks menu', async () => {
  await fixture.page.getByRole('link', { name: 'Tasks' }).click();
})

When('I click on {string} in the tasks menu', async (option: string) => {
  await fixture.page.locator(`//li//a[text()="${option}"]`).click({ timeout: 10000 })
})

When('I credit the created transaction', async () => {
  transactionNumber = await receivablesPage.creditTransaction(transactionNumber)
})

Then('the {string} page should be displayed', async (page: string) => {
  await fixture.page.waitForTimeout(5000)
  await assert.assertTitleContains(page)
})

When('I enter the transaction number in the input box', async () => {
  await fixture.page.locator("//input[@aria-label = ' Transaction Number']").click()
  await fixture.page.locator("//input[@aria-label = ' Transaction Number']").fill(transactionNumber)
  await fixture.page.waitForTimeout(3000)
})

When('I click on the transaction number link', async () => {
  await fixture.page.locator(`//a[contains(text(), '${transactionNumber}')]`).click({ timeout: 10000 })
})

When('I unapply the application', async () => {
  await receivablesPage.unapplyApplicationInCreditMemo()
})

When('I account the unapplication of the credit memo', async () => {
  await fixture.page.getByRole('cell', { name: /^Apply Credit Memo/ }).getByRole('link', { name: 'Actions' }).click()
  await fixture.page.getByRole('cell', { name: 'Account in Draft', exact: true }).click()
})

Then('the accounting should be completed successfully', async () => {
  await receivablesPage.assertUnapplication()
})

Then('the accounting lines window should be displayed', async () => {
  await receivablesPage.assertDisplayOfAccountingLinesWindow()
})

Then('the row containing the credit memo application details should be removed', async () => {
  await receivablesPage.assertRowDeletionInCreditMemo()
})

When('I click on the {string} button in the credit memo actions menu', async (button: string) => {
  await receivablesPage.clickOnButton(button)
})
When('I select the transaction source as {string} in the Transaction source input box', async function (transactionSource:string) 
{
  await receivablesPage.searchingTheTransactions(transactionSource);  
});
Then('I should see the searched transaction with transaction source as {string}', async function(transactionSource:string)
{
  await fixture.page.locator("//table[@summary='Search Results']//tbody//tr[1]//td[4]//span").waitFor({timeout:60000});
 const actualSource = await fixture.page.locator("//table[@summary='Search Results']//tbody//tr[1]//td[4]//span").textContent(); 
 assert.assertEquals(actualSource,transactionSource);
});
When('I click on the transaction number from the search results', async function(){
  await fixture.page.locator("//table[@summary='Search Results']//tbody//tr[1]//td[3]//span//a").click();
})
Then('I should see the Review Transaction page with invoice details', async function () 
{
  await fixture.page.locator("//h1[contains(text(),'Review Transaction: Invoice')]").waitFor({timeout:10000});
  assert.assertTrue(await fixture.page.locator("//h1[contains(text(),'Review Transaction: Invoice')]").isVisible());
});
When('I click on the Tax amount', async function () 
{
 await fixture.page.locator("//label[text()='Tax']//following::table//tbody//td/a/span").first().click();
});
Then('I should not see the Tax lines in the Detail Tax Lines popup',{timeout:500000}, async function () 
{
  await fixture.page.waitForTimeout(3000);
  await fixture.page.getByText('No data to display.').click();
  await fixture.page.getByRole('button', { name: 'OK' }).click();
});

When('I click on {string} Icon in the Top-Left Corner', async(option: string) => {
  await fixture.page.getByRole("link",{name:`${option}`,exact:true}).click()
})

When('I click on the Transaction Number link in the {string} Page', async(page: string) => {
  expect(await fixture.page.getByRole("heading",{name:page})).toBeVisible({timeout:60000})
  await fixture.page.getByRole("link",{name:transactionNumber}).click()
  await fixture.page.waitForTimeout(3000)
})

When('I click on {string} from the {string} Dropdown in {string} Page', async(option: string, dropdown: string, page:string) => {
  await expect(fixture.page.locator(`//div[contains(@title, "${page}")]`)).toBeVisible({timeout:60000})
  await fixture.page.getByRole("link",{name:dropdown,exact:true}).click()
  await fixture.page.waitForTimeout(3000)
  await fixture.page.getByText(option).click({timeout:60000})
  await fixture.page.waitForTimeout(3000)
})

When('I select Credit Reason from the {string} Dropdown', async(option: string) => {
  await fixture.page.getByRole("combobox",{name:option}).selectOption("Billing")
})

When('I enter {string} under {string} section', async(label:string,section: string) => {
  expect(await fixture.page.getByRole("heading",{name:section})).toBeVisible({timeout:60000})
  await fixture.page.getByLabel(label).nth(0).fill("100")
  await fixture.page.keyboard.press("Tab")
})

When('I click on {string} Button under {string} Section', async(option: string, section: string) => {
  expect(await fixture.page.getByRole("heading",{name:section})).toBeVisible({timeout:60000})
  await fixture.page.getByRole("button",{name:option}).click()
})

When('I click on {string} Button', async(option: string) => {
  await fixture.page.getByRole("button",{name:option,exact:true}).click()
})

Then('I click on {string} in the Edit Distributions window', async(option: string) => {
  await fixture.page.getByRole("button",{name:option}).click()
})

When('I click on {string} from {string} DropDown', async(option: string, dropdown: string) => {
  await fixture.page.getByTitle(dropdown).click()
  await fixture.page.getByText(option).click()
})

Then('I should see Status as {string} for the Transaction', async(option: string) => {
  expect(await fixture.page.getByRole("link",{name:option})).toBeVisible({timeout:60000})
})

When('I click on {string} Icon', async(option: string) => {
  await fixture.page.getByLabel(option).click({ timeout: 60000 })
})
When('I click on the {string} under Accounting from the Task Panel', async (accountingOption: string) => {

  await fixture.page.locator("//img[@title='Tasks']").click();
  await fixture.page.getByRole('link', { name: accountingOption }).click();
})
Then('I should see the {string} page opens with below two tabs', async function (header:string, tabs:DataTable) 
{
 await fixture.page.getByRole("heading",{name:`${header}`}).waitFor({timeout:15000})
 assert.assertTrue(await fixture.page.getByRole("heading",{name:`${header}`}).isVisible())
 await receivablesPage.verifyJournalEntriesTabs(tabs);
});
When('I enter ledger as {string} and journal source as {string} and date in the search fields of Journal entries section', async function (ledgerName, journalSource) {
  await receivablesPage.enterTheJournalEntriesSearchFields(ledgerName,journalSource);
});
Then('I should see the search results',{timeout:600000}, async function () 
{
  assert.assertTrue(await fixture.page.locator("//span[text()='Accounting Date']//following::table[@summary='Search Results']/tbody/tr").first().isVisible());
});
When('I select any transaction from the search results', async function () {
  await receivablesPage.selectTransactionFromSearchResults();
});
Then('I should see the {string} and {string} tabs will appear in the bottom part of the screen', async function (summaryTab, transactionTab) 
{
  assert.assertTrue(await fixture.page.getByRole("link",{name:`${summaryTab}`}).isVisible());
  assert.assertTrue(await fixture.page.getByRole("link",{name:`${transactionTab}`}).isVisible());
});
When('I click on {string} tab', async function (tabName:string) 
{
  await fixture.page.getByRole("link",{name:`${tabName}`}).click();
});
Then('I should see the journal details as {string} and Entry Description and Accounting Date and Journal Category under journal summary tab', async function (ledger) 
{
  await receivablesPage.verificationOfJournalEntryDetails(ledger);
  
});
Then('I should see the Transaction details as customer name and customer number and business unit as {string} and invoice number and transaction type under Transaction Summary tab', async function (businessUnit) 
{
  await receivablesPage.verificationOfTransactionSummaryTabDetails(businessUnit);
});
When('I click on Done button', async function()
{
await fixture.page.locator("//div[@class='xeq p_AFTextOnly']//a[@role='button']").click();
});
Then('I should see Review Journal Entries page closes and {string} page should display', async function(header:string)
{
  await fixture.page.getByRole("heading",{name:`${header}`}).waitFor({timeout:20000});
  assert.assertTrue(await fixture.page.getByRole("heading",{name:`${header}`}).isVisible());
});  

When('I click on the first record link with Transaction Number', async function () {
  await fixture.page.locator("(//a[contains(text(),'I2')])[1]").click({ timeout: 60000 });
  await new Promise((resolve) => setTimeout(resolve, 8000));
});

When('I create a Receipt with the below details', async(datatable : DataTable) => {
    
await receivablesPage.createReceipt(datatable);
})  


When('I click on Save and Close', async() => {
  await fixture.page.locator(`//span[text()="S"]`).click();
})




When('I click on {string} icon in Process Details Page', async(option: string) => {
  await fixture.page.locator(`//img[@title='${option}']`).click({ timeout: 6000 });
 
})

Then('the process status should update to Succeeded', async() => {
  let a = await receivablesPage.checkProcessIdStatus(id);
  console.log(a);
  while(!a[0] || !a[1]){
    await fixture.page.locator(`//img[@title='Refresh']`).click({ timeout: 6000 });
    a = await receivablesPage.checkProcessIdStatus(id);
    if(a[0]==true && a[1]==true) break;
  }
})

Then('I click on the {string} under Review Customer Account Details from the Task Panel', async(option: string) => {
  await fixture.page.locator('//img[@title="Tasks"]').click();
  await fixture.page.locator('//a[text()="Review Customer Account Details"]').click();
})

When('I enter {string} as Customer',async (option:string) => {
  await fixture.page.getByRole("textbox",{name:"Customer"}).fill(option)  
})

When('I click on {string} in the Review Customer Account Details',async (option: string) => {
 await fixture.page.getByRole("button",{name:option,exact:true}).click();
 await fixture.page.waitForTimeout(20000)
})

Then('I should be able to view the following Account details',async (dataTable: DataTable)=> {
 await receivablesPage.accountDetails(dataTable)

})

When('I click on {string} Icon in the {string} Page', async(option: string, page: string) => {
  expect(await fixture.page.getByRole("heading",{name: new RegExp(`${page}`)})).toBeVisible({timeout:60000})
  await fixture.page.getByRole("img",{name:option}).click()
})

When('I fill the Create Adjustments popup with the following details:', async(data:DataTable) => {
  await receivablesPage.createAdjustments(data)
})

When('I click on {string} Button in {string} Popup window', async(button: string, window: string) => {
  expect(await fixture.page.locator(`//div[contains(text(),"${window}")]`)).toBeVisible({timeout:60000})
  await fixture.page.getByTitle("Save").click()
})

Then('I should see a popup with message {string}', async(message: string) => 
  {
  await fixture.page.waitForTimeout(2000) 
  const sentence = await fixture.page.locator("//div[contains(text(),'has been created.')]").textContent();
  const regex = /^The adjustment \d+ has been created\.$/;
  const match = regex.test(sentence);
  approvalNumber = sentence?.match(/adjustment\s(\d+)/)[1];
  console.log(approvalNumber)

  console.log(match);
  if (match) {
      console.log("The sentence matches the pattern.");
  } else {
      console.log("The sentence does not match the pattern.");
  }
})

Then('I click on {string} Button in the Popup Window', async(button: string) => {
  await fixture.page.getByRole("button",{name:button}).click()
  await fixture.page.getByRole('link', { name: 'Home', exact: true }).click()
  await fixture.page.waitForTimeout(3000)
})


When('I search for customer named {string}', async function(customerName: string) {
  await fixture.page.waitForTimeout(1000);

  await fixture.page.getByRole('textbox', {name: 'Search Text'}).fill(customerName);
  await fixture.page.waitForTimeout(1000);

  await fixture.page.getByRole('button', {name: "Search"}).click({ timeout: 10000 });
  await fixture.page.waitForTimeout(1000);
  await fixture.page.getByRole('link', {name: "Jmg Realty, Inc."}).last().click({ timeout: 10000 });

 
});
 
When('I select {string} transcation and click on {string}',async function (transactionNumber: string, button: string) {
  
  await receivablesPage.searchTransaction(transactionNumber, button);
});
 
When('I create a new Adjustment with the following details:', async function(data: DataTable) {
  await receivablesPage.createNewAdjustment(data);
});
 
When('I click on {string}',async function (submitButton: string) {
  await fixture.page.getByRole('button', {name: `${submitButton}`}).click({ timeout: 10000 });
})
When('I click on {string} in the adjustment info popup',async function (button: string) {
  await fixture.page.waitForTimeout(2000);
  
  const adjustmentConf = fixture.page.getByText(/^The adjustment \d+ has been created.$/)
  await expect(adjustmentConf).toBeVisible({ timeout: 20000 })
  adjustmentNum = ((await adjustmentConf.textContent()).trim().split(' '))[2]
  console.log("Adjustment Number: ",adjustmentNum);

  await fixture.page.getByRole('button', {name: button}).click({ timeout: 10000 });
});


When('I select new profile class as {string} or {string}', async(profileClass: string,profileClass2 : string) => {
  
  receivablesPage.selectNewProfileClass(profileClass,profileClass2);
  

})

Then('I click Yes in the warning pop updated', async() => {
  await fixture.page.locator(`//span[text()="Y"]`).click();
})
When('I search  for {string} in process details page',{timeout:500000}, async(option: string) =>{
  await receivablesPage.searchandName(option)
});
 When('I select the details in that page',async()=>{
await receivablesPage.ProcessDetails();

 });
 Then('I capture the Process ID number', async function () {
  await receivablesPage.processIdNumber();
});

When('I select the details', async() => {
  await receivablesPage.processDetailsforUpdateSummData();
})

When('I enter the deatils in that page', async() => {
  await fixture.page.getByTitle("RP CA BU").selectOption({index:4})
})



When('I click on the {string}', async(s: string) => {
await receivablesPage.searchRequestID()

})

When('I click on {string} symbol', async (s: string) => {

  
  await fixture.page.locator(`//img[@title="${s}"]`).click();
  await fixture.page.waitForTimeout(3000);
    
  });

Then('I see the generated output', async() => {
  await receivablesPage.reportGenerationOutput();
})

When('I click on Refresh', async() => {
  
  await fixture.page.waitForLoadState('load', { timeout: 10000 });
  await receivablesPage.refreshSymbol();
})
When('I enter the {string} in the {string} input box', async(TransactionNumber: string, option: string) => {
  await fixture.page.getByRole("textbox",{name:option,exact:true}).fill(TransactionNumber)
})

Then('I should see Transaction {string} displayed', async(TransactionNumber: string) => {
  await expect(fixture.page.getByRole("cell",{name:TransactionNumber,exact:true})).toBeVisible({timeout:60000})
})

When('I click on the Transaction Number {string} link in the Manage Transactions Page', async(TransactionNumber: string) => {
  await fixture.page.getByRole("link",{name:TransactionNumber}).click()
})

When('I enter {string} as Dispute Amount in dispute details section', async(disputeAmount:string) => {
  await fixture.page.getByRole("textbox",{name:"Dispute Amount",exact:true}).fill(disputeAmount)
})

When('I click on {string} Button in the {string} popup', async(button: string, message: string) => {
  await expect(fixture.page.getByText(`${message}`)).toBeVisible({timeout:60000})
  await fixture.page.getByRole("button",{name:button,exact:true}).click()
  notification = await fixture.page.getByText(`${message}`).textContent()
  const numberMatch = notification.match(/\d+/);
  disputeId = numberMatch[0];
  console.log(disputeId)
  
})

When('I select {string} as the Dispute Reason', async(disputeReason: string) => {
  await fixture.page.getByRole("combobox",{name:"Dispute Reason"}).selectOption('Billing System Issue')
})

When('I click on {string} link under the {string} Section', async(link: string, section: string) => {
  await expect(fixture.page.getByText(`${section}`)).toBeVisible({timeout:60000})
  await fixture.page.getByText(`${link}`,{exact:true}).click()
})

Then('I should see dispute transaction state as submitted in the {string} Page',{timeout:100000}, async(page:string) => {
  await receivablesPage.verifyNotification(page,disputeId)
})

When('I should see a popup with message Transaction has been completed', async() => {
  notification = await fixture.page.getByText("has been completed").textContent()
  const numberMatch = notification.match(/\d+/);
  transactionNumber = numberMatch[0];
  console.log(transactionNumber)
})

When('I click on the {string} link', async function (option: string) {
  await fixture.page.getByRole('link', { name: option }).click({ timeout: 20000 });
})

When('I query the transaction using the filters', async () => {
  await receivablesPage.queryTransactionForDispute()
})

Then('the transaction should be retrieved successfully', async () => {
  await expect(fixture.page.getByRole('cell', { name: transactionNumber, exact: true })).toBeVisible({ timeout: 20000 })
})

When('I fill in the details for the dispute', async () => {
  await receivablesPage.fillDetailsForDispute()
})

Then('a popup should be displayed confirming the action with the message containing the text {string}', async (message: string) => {
  await receivablesPage.assertPopupWithMsg(message)
})

Then('the disputed amount should be reflected in the view', async () => {
  await receivablesPage.assertDisputedAmt()
})

Then('the transaction status should be set to {string}', async (status: string) => {
  await receivablesPage.assertTransacStatusAfterDispute(status)
})
Then('I see Manage Customers page', async() => {
  await expect(fixture.page.getByRole('heading',{name:'Manage Customer'})).toBeVisible();
})

When('I enter Organization Name', async() => {
  await fixture.page.getByRole('textbox',{name:'Organization Name'}).fill('JMG');
})

When('I click on Search Button', async() => {
 await fixture.page.keyboard.press('Enter');
})
Then('I see Edit Account page', async() => {
  await fixture.page.waitForTimeout(3000);
  await expect( fixture.page.locator("//h1[contains(text(),'Edit Account')]")).toBeVisible();
})

When('I click on Communication Tab', async() => {
 
await fixture.page.getByRole('link',{name:'Communication'}).click();

})

When('I click on Edit Contacts button under Communication Tab', async() => {
  await fixture.page.getByRole('button',{name:'Edit Contacts'}).click();
  
})

When('I click on Create Contact icon', async() => {
  await fixture.page.locator("//img[@title='Create Contact']").click();
  await fixture.page.waitForTimeout(1000);
})

When('I enter the required details', async() => {
 await receivablesPage.createContact();
})

Then('I see Create Contact', async() => {
 await expect(fixture.page.locator("//div[text()='Create Contact']")).toBeVisible();
})

Then('I click on OK button', async() => {
  
  await fixture.page.locator("//button[@title='OK']").click();
  
})

Then('I select the new contact created', async() => {
  await fixture.page.locator('//a[text()="Test"]').click();
})

Then('I click on the Create icon under Contact Points', async() => {
  await fixture.page.locator("(//img[@title='Create'])[1]").click();
})

Then('I enter the mandatory fields', async() => {
 
  await fixture.page.locator('//input[@protectionkey="PhoneEO.PhoneNumber"]').fill('1234567890')
})

Then('I see Contact Points', async() => {
 await expect(fixture.page.getByRole('heading',{name:'Contact Points'})).toBeVisible();
})

When('I click on OK', async() => {
await fixture.page.getByRole('button', { name: 'OK' }).click();


})

When('I select the {string} cell from the Search', async(orgName:string) => {
  
  await fixture.page.getByRole('cell', { name: 'More... '+ orgName, exact: true }).click();
     await fixture.page.waitForTimeout(3000);
})
When('I click on the {string} link which is highlighted under Accounts region', async(accNum:string)=>{
  await fixture.page.getByRole('link',{name: accNum}).click();
  await fixture.page.waitForTimeout(3000);
})
  Then('I see the new contact created', async()=> {
    if (await fixture.page.locator('//a[text()="Test"]').isVisible()) {
          console.log("Yes, the element is visible");
        }
  })
  When('I select Transaction Source as {string} and Transaction Class as {string} and Transaction Type as {string}', async function (transactionSource, transactionClass, transactionType) {
    await receivablesPage.enterManageTransactionDetails(transactionSource,transactionClass,transactionType);
  });
  Then('I should see the search results display with the search criterion', async function () {
    const value = await receivablesPage.verifySearchResults();
    assert.assertTrue(value);
  });
  When('I click on the Transaction Number link from the search results', async function () {
    await fixture.page.locator("//table[@summary='Search Results']//tbody//tr[1]//td[3]//span//a").click();
  });
  Then('I see the {string} page opens', async function (headerTitle) {
    await fixture.page.getByRole('heading', {name:headerTitle}).waitFor({timeout:20000});
    assert.assertTrue(await fixture.page.getByRole('heading', {name:headerTitle}).isVisible());
  });
  When('I click on the {string} option under the {string} link button', async function (subOption, actionsLink) {
    await receivablesPage.clickOnTheSubOptionsInActionsLink(subOption,actionsLink);
  });
  Then('I see the {string} window', async function (createAdjustmentWindow) 
  {
    await fixture.page.getByText(`${createAdjustmentWindow}`).waitFor({timeout:15000});
    assert.assertTrue(await fixture.page.getByText(`${createAdjustmentWindow}`).isVisible());
  });
  When('I select Receivables Activity as {string} and Adjustment Type as {string} and Adjustment Amount as {string}', async function (receivablesActivity, adjustmentType, adjustmentAmount) {
    await receivablesPage.createAdjustment(receivablesActivity,adjustmentType,adjustmentAmount);
  });
  Then('I see the Created Adjustment in the Manage Adjustment Page', async function () 
  {
    await fixture.page.locator(`//td[@class='xen']//span[text()='${approvalNumber}']`).waitFor({timeout:20000});
    let value: boolean = await fixture.page.locator(`//td[@class='xen']//span[text()='${approvalNumber}']`).isVisible();
    assert.assertTrue(value);
    console.log("Able to see the Created Adjustment:"+" "+approvalNumber);
    await fixture.page.waitForTimeout(3000);
    await receivablesPage.signOutFromFusion();
  });
  When('I click on the Approval Infotile to view Adjustment on the left portion of the screen',{timeout:1500000}, async function () {
    await fixture.page.getByRole('link', { name: 'Select : Approval' }).click();
  });
  When('I select the adjustment under review then click on {string} button', async function (approveButton:string) 
  {
    await fixture.page.waitForTimeout(5000);
    await fixture.page.locator("(//table[@class='x1hp'])[2]//tbody//tr[2]//td[1]//input").fill(approvalNumber);
    await fixture.page.keyboard.press('Enter');
    await fixture.page.waitForTimeout(3000);
    await fixture.page.locator("//span[text()='Write-off to Credit Agency']").click();
    await fixture.page.getByRole('button',{name:`${approveButton}`,exact:true}).click();
  });
  Then('I see the Approve Adjustment popup window', async function () 
  {
    await fixture.page.locator("//div[contains(text(),'Approve Adjustment')]").waitFor({timeout:15000});
    assert.assertTrue(await fixture.page.locator("//div[contains(text(),'Approve Adjustment')]").isVisible());
  });
  When('I enter comment in the Approve Adjustment popup', async function () {
    await fixture.page.getByLabel('Comments').fill('test');
  });
  Then('I see the confirmation message as Approved', async function () 
  {
    await fixture.page.locator("//div[contains(text(),'has been approved.')]").waitFor({timeout:10000});
    const message = await fixture.page.locator("//div[contains(text(),'has been approved.')]").textContent();
    const regex = /Adjustment (\d+) has been approved\./;
    const match = message.match(regex);
    expect(match).not.toBeNull();
    expect(match[1]).toBe(approvalNumber);
    console.log("Adjustment got Approved...");
  });

When('I open {string} in {string}', async(setup: string, icon: string) => {
  await fixture.page.getByRole('img',{name: icon}).click();
  await fixture.page.getByRole('link',{name: setup}).click();
})

When('I navigate to {string}',async (page: string) => {
   await receivablesPage.navigateToManageCollectionStrategies(page);
})

When('I enter {string} as {string}',async (option: string, text: string) => {
  strategyNum = faker.number.int({ min: 1, max: 100 });
  await fixture.page.getByRole("textbox", { name: option }).fill(text + strategyNum);
})

When('I provide following details under Strategies:', async(data: DataTable) => {

  const details = data.rowsHash()
  await fixture.page.getByRole("img", { name: 'Add Row' }).first().click({ timeout: 60000 });
  await fixture.page.getByRole("textbox", { name: 'Method Name' }).fill(details['Method Name'] + strategyNum);
  await fixture.page.getByRole("textbox", { name: 'Lowest Applicable Score' }).fill(details['Lowest Applicable Score']);
  await fixture.page.getByRole("img", { name: 'Add Row' }).last().click({ timeout: 60000, force: true });
})

When('I select and add task', async() => {
  await receivablesPage.addTask();
})

When('I click on the {string} icon', async(icon: string) => {
  await fixture.page.getByRole("img", { name: icon }).click({ timeout: 60000 });
})

Then('I should see new window with all available tasks',async () => {
  expect(fixture.page.locator("//div[text()='Select and Add: Task']")).toBeVisible({timeout:20000})
})

Then('I should able to see created strategy', async () => {

  expect (fixture.page.getByRole("link", { name: "Account test" + strategyNum, exact: true  })).toBeVisible({timeout:20000})
  
})

When('I enter the {string} as {string}', async(option: string, text: string) => {
  await fixture.page.getByRole("textbox", { name: option }).fill(text);
})

When('I search and approve adjustment', async() => {
   await receivablesPage.approveAdjustment(adjustmentNum);
})

Then('I should see the popup with message {string}', async (s: string) => {
  const sentence = await fixture.page.locator("//div[contains(text(),'has been approved.')]").textContent();
  const regex = /^Adjustment \d+ has been approved\.$/;
  const match = regex.test(sentence);

  expect(sentence).toMatch(regex);
  
  console.log(match);
  if (match) {
      console.log("The sentence matches the pattern.");
  } else {
      console.log("The sentence does not match the pattern.");
  }
})

Then('I click on {string} button in confirmation popup and signout',async (option: string) => {
  await fixture.page.getByRole('button', { name: option }).click();
  await receivablesPage.signOutFromFusion();
})

Then('I should see Adjustment Status as Approved.', async() => {
  const element =  fixture.page.locator(`(//tbody/tr[.//span[contains(@class, 'x2hi') and text()='${adjustmentNum}']])[3]`);

  if(element){
    const textContent = await element.innerText();
    expect(textContent).toContain("Approved");
  }
  else{
    console.log('Element not found')
  }

})

When('I create a Credit memo transaction with the following details:', async(data: DataTable) => {
  await receivablesPage.createCreditMemo(data);


})


When('I click on Save Button', async  ()=> {
 await fixture.page.getByRole('button',{name:'Save',exact:true}).click();
 await fixture.page.waitForTimeout(5000);

});

When('I click on Tax Determination', async() => {
  
  await fixture.page.getByRole('link',{name:'Tax Determinants'}).click();
  await fixture.page.waitForTimeout(2000);

})
When('I populate Tax Classification', async() => {
  await fixture.page.locator("(//input[contains(@id, 'taxClassificationCodeId')])[1]").fill('US CONVERSION RATE');;
  await fixture.page.keyboard.press("Enter");
 

  
})
When('I click on the pencil icon', async() => {
  await fixture.page.locator("(//img[contains(@id,'commandImageLink')])[1]").click();
  await fixture.page.waitForTimeout(5000);
})

When('I click on the Actions button', async() => {

await fixture.page.locator("(//div[@aria-label='Actions'])[2]").click({timeout:10000});
})

When('I click on Add row', async() => {
await fixture.page.getByRole('menuitem',{name:'Add Row'}).click({timeout:10000});
})

When('I select the Rate Name', async() => {
await fixture.page.getByRole('combobox',{name:'Rate Name'}).fill('***VENDOR CHRG TAX RATECDP2P***');
await fixture.page.keyboard.press('Enter');
await fixture.page.waitForTimeout(5000);

})

Then('I see updated Tax', async() => {

const updatedTax = await fixture.page.locator('//span[@id="_FOpt1:_FOr1:0:_FONSr2:0:MAnt2:2:pt1:Trans1:0:ap110:inputText134"]').innerText();
await assert.assertTrue(parseFloat(updatedTax) > 0);
console.log('The value is updated:',updatedTax);


})

Then('I see the Detail Tax Lines pop-up', async() => {
  await fixture.page.getByText(/ Credit Memo .+: Detail Tax Lines/).waitFor({timeout:20000})
  await expect(fixture.page.getByText(/ Credit Memo .+: Detail Tax Lines/)).toBeVisible({timeout:20000});

})

When('I click on Save and Close button', async() => {
await fixture.page.getByRole('button',{name:'Save and Close'}).click({timeout:20000});
await fixture.page.waitForTimeout(3000);

})

Then('I see the status as incomplete', async() => {
await expect(fixture.page.locator("//label[text()='Status']//following::td[text()='Incomplete']")).toBeVisible();
})

Then('I click on Actions button', async() => {
await fixture.page.locator("//a[contains(text(),'Actions')]").click();
})

Then('I click on Edit Distributions', async() => {
await fixture.page.getByText('Edit Distributions').click().then(() => fixture.page.waitForTimeout(2000));

})

Then('I see Edit Distributions pop-up', async() => {
await expect( fixture.page.locator('//div[text()="Edit Distributions"]')).toBeVisible();

})

When('I select Distribution', async() => {
await fixture.page.locator('(//img[@title="Select: Distribution"])[1]').click();
})

Then('I see Edit Transaction page', async() => {
await fixture.page.getByRole('heading',{name:/Edit Transaction: Credit Memo \+d/});
})


When('I click on {string} dropdown', async(dropdown:string) => {
await fixture.page.getByRole('link', { name: dropdown }).click();

})


When('I save and close the transaction in Edit Transaction Page', async() => {

await fixture.page.locator('//a[@title="Save"]').click();
await fixture.page.getByRole('menuitem',{name:"Save and Close"}).click()
})
When('I fill the Memo lines under Credit Memo Details', async() => {
  await fixture.page.locator("(//input[contains(@id, 'memoLineName')])[1]").fill('Fixed Bid Contract Line')
  await fixture.page.keyboard.press("Enter")
})

When('I create a Receipt with the following details:', async(data:DataTable)=>{
  receiptDetails = await receivablesPage.createCustomerReceipt(data)
  receiptNumber =receiptDetails[0]
  receiptAmount =receiptDetails[1]
})

When('I click in Add Icon to attach documents at the receipt header level', async()=>{
  
  await fixture.page.getByRole("img",{name:"Manage Attachments",exact:true}).click()
  await fixture.page.locator("//input[@type='file']").setInputFiles("Test_Data/TC33040_SampleData.txt")
  await fixture.page.getByRole("button",{name:"OK",exact:true}).click()
})

When('I click on {string} from {string} dropdown', async(option:string,dropdown:string)=>{
  await fixture.page.getByTitle(dropdown).click()
  await fixture.page.getByText(option,{exact:true}).click()
})

Then('I should see a popup with message Receipt has been created sucessfully', async()=> {
  await expect(fixture.page.getByText(`Receipt number ${receiptNumber} has been created.`)).toBeVisible({timeout:30000})
  await fixture.page.getByRole("button",{name:"OK",exact:true}).click({timeout:30000})
})

When('I enter receipt number in the {string} input box', async(input:string)=>{
  await fixture.page.getByRole("textbox",{name:input,exact:true}).fill(receiptNumber)
})

Then('I should see the searched receipt', async()=> {
  await expect(fixture.page.getByRole("cell",{name:receiptNumber,exact:true})).toBeVisible({timeout:30000})
})

When('I click on Receipt Number link', async()=>{
  while(!(await fixture.page.locator(`//div[contains(@title, "Edit Receipt")]`).isVisible({ timeout: 60000 }))){
    await fixture.page.getByRole("link",{name:receiptNumber,exact:true}).click()
    await fixture.page.waitForTimeout(2000)
  }
  
})

When('I should see whole receipt amount displayed under Unapplied Amount', async()=>{
  await expect(fixture.page.getByRole('row', { name: `Unapplied Amount ${receiptAmount}`, exact: true })).toBeVisible({timeout:30000})
})

When('I click on {string} Tab under the Receipt Details Section', async(option:string)=>{
  await fixture.page.getByRole("link",{name:option,exact:true}).click({timeout:20000})
})

When('I enter transaction number in the {string} Input box', async(option:string)=>{
  await fixture.page.getByRole("textbox",{name:option,exact:true}).fill(transactionNumber)
})

When('I click on the transaction number row', async()=>{
  await fixture.page.getByRole("cell",{name:transactionNumber,exact:true}).first().click()
})

Then('I should that the Total Applied Amount has changed', async()=>{
  await expect(fixture.page.getByRole('row', { name: `Total Applied Amount ${receiptAmount}`, exact: true })).toBeVisible({timeout:30000})
  await fixture.page.getByRole("button",{name:"Save and Close",exact:true}).click({timeout:20000})
})

When('I create a transaction with the following details with certain Amount:', async (data: DataTable) => {
  transactionDetails = await receivablesPage.createTransactionSpecificAmount(data)
  transactionNumber =transactionDetails[0]
  transactionAmount =transactionDetails[1]
})

When('I click on {string} in the Navigator', async(option:string)=>{
  await fixture.page.getByRole("link",{name:"Navigator",exact:true}).click()
  await fixture.page.getByRole("link",{name:option,exact:true}).click()

})

When('I click on {string} in the {string} Dropdown under the Application Tab', async(option: string,dropdown:string) => {
await fixture.page.getByRole("link",{name:dropdown,exact:true}).nth(1).click()
await fixture.page.getByText(option,{exact:true}).click()
})

When('I click on {string} from the options', async(option:string) => {
await fixture.page.getByText(option,{exact:true}).click()
})

When('I click on {string} Button in the Popup', async(option: string) => {
await fixture.page.getByRole("button",{name:option,exact:true}).click()
})

Then('I should see that the On-Account Amount has changed', async function () {
await expect(fixture.page.getByRole('row', { name: `On-Account Amount ${receiptAmount}`, exact: true })).toBeVisible({timeout:30000})
await fixture.page.getByRole("button",{name:"Save and Close",exact:true}).click({timeout:20000}) 
});

When('I click on {string} option from the {string} Dropdown at the Header Level', async(option: string, dropdown: string) => {
await fixture.page.getByRole("link",{name:dropdown,exact:true}).first().click()
await fixture.page.getByText(option,{exact:true}).click()
})

When('I set the Reason for Reversal as {string}', async(reason: string) => {
await fixture.page.getByTitle("Search: Reason").click()
await fixture.page.getByText(reason,{exact:true}).click()
})

When('I enter the Category for Reversal as {string}', async(category: string) => {
await fixture.page.getByRole("combobox",{name:"Category",exact:true}).selectOption(category)
})

Then('I should see status as Reversed', async() => {
await expect(fixture.page.getByRole("cell",{name : "Reversed",exact:true})).toBeVisible({timeout:300000})
await fixture.page.getByRole("button",{name:"Cancel",exact:true}).click()
})

When('I click on {string} Button in the {string} Window', async(button: string,popup:string) => {

while(await fixture.page.getByText(popup).isVisible()){
  await fixture.page.getByRole("button",{name:button,exact:true}).click()
  await fixture.page.waitForTimeout(1000)
}
})

Then(
"I should see {string} Page and the following Receipt Information",
async function (page:string,table: DataTable) {
  expect(await fixture.page.locator(`//div[contains(@title, "${page}")]`).isVisible({ timeout: 60000 }))
  const test = table.rows();
  console.log(test);

  for (let i = 0; i < test.length; i++) {
    console.log(i);
    console.log(test[i][0]);
    const b = await fixture.page.locator(`label.af_panelLabelAndMessage_label-text:has-text("${test[i][0]}")`).isVisible();

    await assert.assertTrueWithMessage(b, `${test[i][0]} is not visible`);
  }
}
);
