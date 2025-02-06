import { DataTable, Given, Then, When } from "@cucumber/cucumber"
import { fixture } from "../../hooks/pageFixture"
import { expect, type Locator } from "@playwright/test"
import { assert, payablesPage } from "../../hooks/hooks"
import { AsyncResource } from "async_hooks"
import { faker, fi } from "@faker-js/faker";
import { type Page } from '@playwright/test';
import { options } from "../../helper/util/logger"

var id;
let randNum: number;
let batchName: string
let processID: string
let invoiceNum: string;
let assetNum: string;

Given(
  'I login to the fusion application using the {string} role',
  async function (role: string) {
    await payablesPage.signInToFusion(role)
  }
)

When('I navigate to the {string} menu and select the {string} page', async function (menu: string, section: string) {
  await payablesPage.navigateToInvoicesPage(menu, section);
})

Then('I should see {string} page', async (pageName: string) => {
  expect(await fixture.page.locator(`//div[contains(@text,'${pageName}')]`).isVisible({ timeout: 60000 }));

})

When('I open the {string} tab', async function (tab: string) {
  await fixture.page.locator("//img[@title='Tasks']").click();
  await fixture.page.locator(`//a[text()='${tab}']`).click();
})

When('I enter the invoice number {string} interfaced from Coupa in the search field', async function (invoiceNum: string) {
  await fixture.page.locator("//input[@aria-label=' Invoice Number']").fill(`${invoiceNum}`);
})

When('I click on {string} to find the invoice and select the invoice to open it', async function (button: string) {
  await fixture.page.locator(`//button[text()='${button}']`).click();
  await fixture.page.locator("//a[text()='COUPA TAX _TEST2']").click();
})

When('I expand the tax section', async function () {
  await fixture.page.locator("(//a[text()='Lines'])[1]").click();
})

Then('I should validate the tax charges applied by the vendor on the invoice', async function () {
  await payablesPage.validateInvoice();
})

When('I click on the {string} option in the Navigator', async (option: string) => {
  await fixture.page.getByLabel("Navigator").click({ timeout: 60000 })
  await fixture.page.getByTitle(option, { exact: true }).click();
})

When('I click on {string} from the {string} Dropdown', async (option: string, dropdown: string) => {
  await fixture.page.getByRole('link', { name: option, exact: true }).click();
  await fixture.page.waitForTimeout(5000)
})

Then('I should see {string} displayed', async function (option: string) {
  await expect(fixture.page.getByRole('heading', { name: option }).first()).toBeVisible()
});

When('I select {string} under Taskpane', async function (option: string) {
  await fixture.page.getByRole('link', { name: 'Tasks' }).click();
  await fixture.page.getByRole('link', { name: option }).click();
})

Then('I should see {string} page displayed', async function (option: string) {
  await fixture.page.getByRole('heading', { name: option }).isVisible();
})

When('I select Journal Name and click on {string}', async function (option: string) {
  await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
})

When('I click the link for the batch to be copied', async function () {
  await fixture.page.locator('//table[@summary="Search Results"]').first().locator('tr').first().locator('td').nth(3).click()
})

When('I click on Batch Actions drop down menu and select {string}', async function (option: string) {
  await fixture.page.getByRole('menuitem', { name: 'Batch Actions' }).locator('div').click();
  await fixture.page.getByRole('cell', { name: 'Copy', exact: true }).click();
})

Then('I should see a new Journal Batch is opened', async function () {
  await fixture.page.getByText('Create Journal');
})

When('I click on Cancel button', async () => {
  await fixture.page.locator('//a[@role="button" and .//span[contains(text(), "C")]]').first().click({ timeout: 30000 })
  await fixture.page.waitForTimeout(5000)
})

Then('I click on {string} to save', async function (option: string) {
  await fixture.page.getByRole('button', { name: option }).click();
})

When('I click on submit button', async () => {
  await fixture.page.locator('//a[@role="button" and .//span[contains(text(), "Sub")]]').first().click({ timeout: 30000 })
  await fixture.page.waitForTimeout(5000)
})

Then('I select the AutoPost Journals process line', async () => {
  await fixture.page.locator(`//td[@class="xen"]`).first().dblclick({ timeout: 6000 });
})

Then('I download the .txt file under the AutoPost Journals', async () => {
  await fixture.page.locator(`//a[@target="_blank"]`).first().click();
})

When('I click on {string} icon', async (option: string) => {
  let a = await payablesPage.CheckProcessIDStatus(id);
  console.log(a);
  while (!a[0] || !a[1]) {
    await fixture.page.locator(`//img[@title='${option}']`).click({ timeout: 6000 });
    a = await payablesPage.CheckProcessIDStatus(id);
    if (a[0] == true && a[1] == true) break;
  }
})

Then('I click on {string} to save confirmation popup', async (option: string) => {
  await fixture.page.getByRole('button', { name: option }).click();
  const text = await fixture.page.locator(`//span[label[contains(text(), 'submitted')]]`).textContent();
  const arr = text.split(" ");
  id = arr[1];
})

When('I click on the {string} button', async (button: string) => {
  await fixture.page.getByRole('button', { name: button, exact: true }).click({ timeout: 20000 })
  await fixture.page.waitForTimeout(3000)
})

When('I Populate Process Parameters accordingly', async () => {
  await payablesPage.populateProcessParams()
})

Then('I should see the confirmation popup', async () => {
  await payablesPage.assertConfirmationPopupVisibility()
})

When('I select the Create Accounting Execution Report process line', { timeout: 120000 }, async () => {
  await payablesPage.clickOnProcessLine()
})

When('I click on Republish button to download the Report', async () => {
  await payablesPage.clickRepublishButton()
});

Then('I should see {string} Page', async (title: string) => {
  await expect(fixture.page.locator(`//div[contains(@title, "${title}")]`)).toBeVisible({ timeout: 60000 });

})

When('I click on the {string} under Invoices from the Task Panel', async (option: string) => {
  await fixture.page.locator("//img[@title='Tasks']").click();
  await fixture.page.getByRole('link', { name: option }).click();
})

When('I Enter Invoice Number as {string} in the {string} input box', async (invoiceNumber: string, option: string) => {
  await fixture.page.getByRole("textbox", { name: option }).fill(invoiceNumber)
})

When('I click on {string} button in {string} Page', async (option: string, page: string) => {
  expect(await fixture.page.getByRole("heading", { name: page })).toBeVisible({ timeout: 10000 })
  await fixture.page.getByRole("button", { name: option, exact: true }).click({ timeout: 20000 })

})
Then('I should see the searched invoice {string}', async (invoiceNumber: string) => {
  await expect(fixture.page.getByRole("cell", { name: invoiceNumber, exact: true })).toBeVisible({ timeout: 30000 })
})

When('I click on the {string} link', async (invoiceNumber: string) => {
  await fixture.page.getByRole("link", { name: invoiceNumber, exact: true }).click()
  await fixture.page.waitForTimeout(7000)
  await fixture.page.locator(`//div[contains(@title, "Manage Invoice")]`).isVisible({ timeout: 20000 })

})

When('I click on {string} under the {string} Dropdown in {string} Page', async (option: string, dropdown: string, page: string) => {
  await fixture.page.locator(`//div[contains(@title, "${page}")]`).isVisible({ timeout: 20000 })
  await fixture.page.getByRole("link", { name: dropdown, exact: true }).click({ timeout: 20000 })
  await fixture.page.getByText(option, { exact: true }).click({ timeout: 10000 })
})

When('I click on {string} Icon in the Manage Holds popup', async (option: string) => {
  await fixture.page.getByRole("img", { name: option, exact: true }).click({ timeout: 20000 })
  await fixture.page.waitForTimeout(5000)
})

When('I select the reason for Hold', async () => {
  await payablesPage.invoiceHoldReason()
})

When('I click on {string} button in the Popup', async (option: string) => {
  const loc = await fixture.page.locator(`//button[contains(text(),"${option}")]`)
  await loc.click({ force: true })
  await fixture.page.waitForTimeout(5000)
})

Then('I click on {string} button in the {string} Page', async (option: string, page: string) => {
  await expect(fixture.page.locator(`//div[contains(@title, "${page}")]`)).toBeVisible({ timeout: 30000 })
  await fixture.page.getByRole("button", { name: option, exact: true }).click({ timeout: 20000 })
})

When('I click on {string} link in the {string} Tile', async (option: string, tile: string) => {
  await expect(fixture.page.getByText(tile)).toBeVisible({ timeout: 30000 })
  await fixture.page.getByRole("link", { name: option, exact: true }).click()
})

When('I select the {string} Invoice', async (invoiceNumber: string) => {
  await fixture.page.getByRole("cell", { name: invoiceNumber, exact: true }).first().click()
})

When('I click on {string} from {string} Dropdown in Invoices Page', async (option: string, dropdown: string) => {
  await fixture.page.getByRole("link", { name: dropdown, exact: true }).click()
  await fixture.page.locator(`//td[contains(text(),"${option}")]`).click({ timeout: 30000 })

})

Then('I should see {string} Popup window', async (title: string) => {
  await expect(fixture.page.locator(`//div[contains(text(),"${title}")]`)).toBeVisible({ timeout: 30000 })
})

When('I select the reason for releasing the Hold', async () => {
  await fixture.page.getByRole("combobox", { name: "Name", exact: true }).selectOption({ index: 1 })
  await fixture.page.keyboard.press("Enter")
  await fixture.page.waitForTimeout(5000)
})

When('I click on {string} button in the Popup window', async (option: string) => {
  await fixture.page.getByRole("button", { name: option, exact: true }).click()
})

When('I click on the {string} from the Task Panel', async (option: string) => {
  await payablesPage.optionInTaskPanel(option)
})

When('I Enter {string} in the Journal Search Box', async (option: string) => {
  await fixture.page.getByRole("textbox", { name: "Journal", exact: true }).fill(option)
})

When('I set Accounting Period to {string}', async (date: string) => {
  await fixture.page.getByRole("combobox", { name: "Accounting Period", exact: true }).fill(date)
})

When('I click on {string} button in the Manage Journals Page', async (option: string) => {
  await fixture.page.getByRole("button", { name: option, exact: true }).click()
})

When('I select click on the Journal Link', async () => {
  await fixture.page.locator("//a[contains(text(),'Test')]").first().click()
})

When('I click on {string} option from {string} Dropdown in Edit Journals Page', async (option: string, dropdown: string) => {
  await fixture.page.getByRole("link", { name: dropdown, exact: true }).click()
  await fixture.page.getByText(option).click()
})

When('I enter the Journal Batch Name in the {string} popup window', async function (title: string) {
  randNum = faker.number.int({ min: 1, max: 1000 })
  batchName = "Test_copy" + randNum
  await expect(fixture.page.getByText(title)).toBeVisible({ timeout: 30000 })
  await fixture.page.getByRole("textbox", { name: "Journal Batch", exact: true }).fill(batchName)
})

When('I click on {string} button in the popup window', async (option: string) => {
  await payablesPage.clickButtonInPopup(option)
})

When('I should see a message {string} in the popup window', async (message: string) => {
  await expect(fixture.page.getByText(message)).toBeVisible({ timeout: 30000 })
})

Then('I click on {string} Button in the popup window', async (option: string) => {
  await payablesPage.clickButtonInPopup(option)
})

When('I search for the process Using Process ID', async () => {
  await payablesPage.searchProcessUsingId(processID)
})

When('I wait till the process is succeeded', async () => {
  const loc = fixture.page.locator('//span[contains(text(),"Succeeded")]')
  do {
    await fixture.page.getByRole("img", { name: "Refresh", exact: true }).click()
    console.log("Waiting to be Succeeded")
  } while (!await loc.isVisible());
  await fixture.page.waitForTimeout(3000)
})

When('I click on the {string} line to view process details', async (report: string) => {
  await fixture.page.getByRole("cell", { name: report, exact: true }).click({ timeout: 30000 })
})

Then('I should see the process confirmation message in a popup window', async () => {
  processID = await payablesPage.getProcessId()
})

When('I fill the following details for Cash to General Ledger Reconciliation Report:', async (data: DataTable) => {
  await payablesPage.reportDetails(data)
})

When('I fill the following details for Bank Statement Report:', async (data: DataTable) => {
  const details = data.rowsHash()
  await fixture.page.getByLabel("Bank Account").fill(details['Bank Account'])
  await fixture.page.getByRole("textbox", { name: "m/d/yy", exact: true }).first().fill(details['From Statement End Date'])
})

Then('I should see the Invoices Dashboard window opens', async function () {
  assert.assertTrue(await fixture.page.getByRole('heading', { name: 'Invoices' }).isVisible());
});
When('I click on the {string}', async function (panelName) {
  await payablesPage.clickOnTheTaskPanel(panelName);
});
When('I click on the {string} from the Invoices panel', async function (taskPanelOption) {
  await payablesPage.clickOnThePanelOptions(taskPanelOption);
});
Then('I should see the Create Invoice window opens', async function () 
{
  await fixture.page.getByRole('heading', { name: 'Create Invoice:' }).waitFor({timeout:20000});
  assert.assertTrue(await fixture.page.getByRole('heading', { name: 'Create Invoice:' }).isVisible());
});
When('I select Business Unit as {string} and Supplier as {string} and fill the Invoice Number in the Invoice Header section', async function (businessUnit:string,supplierName:string) {
  await payablesPage.enterAllTheDetailsToCreateInvoice(businessUnit,supplierName);
});
When('I enter the line item details',{timeout:500000}, async function () {
  await payablesPage.addLineItemsToTheInvoice();
});
When('I enter the below Distribution Combination ID details', async function(details:DataTable)
{
await payablesPage.selectDistributionCombinationIDDetails(details);
});
When('I click on {string} from the {string} link', async function (subLink, invoiceActions) 
{
  await payablesPage.clickOnTheInvoiceActionOptions(subLink,invoiceActions)
});
Then('I see Invoice Summary should appear with the Validation details', async function () 
{
  await payablesPage.clickOnTheValidationLink();
  await payablesPage.verificationOfInvoiceSummary();
  
});
When('I click on Initiate Approval', async function()
{
const validation = await payablesPage.verificationOfInvoiceValidationStatus()
if(validation==="Validated")
{
await payablesPage.initiateInvoiceApproval();
}
else
{
  console.log("status is"+" "+validation)
}
});
Then('I should see the Approval status as {string}', async function(invoiceApprovalStatus:string)
{
const actualStatus = await payablesPage.verifyInvoiceApprovalStatus();
assert.assertEquals(actualStatus,invoiceApprovalStatus);
});
When('I click on Save and Close button', async function () 
{
  await fixture.page.getByRole('button', { name: 'Save and Close' }).click();
});
Then('I should see the Invoice page with Invoices list', async function () 
{
  await fixture.page.getByRole('heading', { name: 'Invoices' }).waitFor({timeout:15000});
  assert.assertTrue(await fixture.page.getByRole('heading', { name: 'Invoices' }).isVisible());
});
When('I search for created invoice', async function () {
  await payablesPage.invoiceSearch();
});
Then('I see the created invoice in the search results', async function () {
  const status = await payablesPage.verifyTheInvoice();
  assert.assertTrue(status);
  console.log("Able to see created Invoice");
});



When('I create an Asset Invoice with the following details:', async (data: DataTable) => {
  invoiceNum = await payablesPage.createAssetInvoice(data);
});

When('I validate the Asset Invoice', async () => {
  await fixture.page.getByRole('link', { name: 'Invoice Actions' }).click();
  await fixture.page.locator("//td[text()='Validate']").click({ timeout: 30000 });
  await fixture.page.locator("//a[text()='Validated']").click({ timeout: 30000 });
})
Then('I should see {string} details', async (heading: string) => {
  await expect(fixture.page.locator(`//div[text()="${heading}"]`)).toBeVisible({ timeout: 30000 });
  await fixture.page.locator("//a[@title='Close' and @class='x1jm']").last().click({ timeout: 30000 });
})
Then('I should see {string} Page.', async (title: string) => {
  await expect(fixture.page.locator(`//div[@title="${title}"]`)).toBeVisible({ timeout: 60000 })
})
When('I search for the created invoice', async () => {
  await payablesPage.searchInvoice(invoiceNum);
})
Then('I should see the created invoice', async () => {
  await expect(fixture.page.locator(`//a[text()="${invoiceNum}"]`)).toBeVisible({ timeout: 60000 });
})
When('I click on {string} from the {string} Dropdown.', async (option: string, dropdown: string) => {
  await fixture.page.getByRole('link', { name: option, exact: true }).click();
  await fixture.page.waitForTimeout(5000)
})
When('I search for {string} Asset', async (assetNum: string) => {
  await fixture.page.getByRole('textbox', { name: 'Asset Number' }).fill(`${assetNum}`);
  await fixture.page.getByRole('button', { name: 'Search' }).last().click();
})
When('I click on {string} tab', async (tab: string) => {
  await fixture.page.locator(`(//a[text()="${tab}"])[last()-1]`).click();
})
Then('I should see Transaction details', async () => {
  await expect(fixture.page.locator("//span[text()='Transfer in']")).toBeVisible({ timeout: 60000 });
  await expect(fixture.page.locator("//span[text()='Addition']")).toBeVisible({ timeout: 60000 });
})
Then('I should see Cost History details', async () => {
  await expect(fixture.page.getByRole('row', { name: 'Fiscal Year Cost' })).toBeVisible({ timeout: 60000 });
})
Then('I should see Depreciation History', async () => {
  await expect(fixture.page.getByRole('row', { name: 'Period Total Amount' })).toBeVisible({ timeout: 60000 });
})

Then('I should see the Update Descriptive Details page with {string}',{timeout:1500000}, async function (searchDetails:string) 
{
  await fixture.page.getByRole('heading', { name: `${searchDetails}` }).waitFor({timeout:15000});
  assert.assertTrue(await fixture.page.getByRole('heading', { name: `${searchDetails}` }).isVisible());
});
When('I select Asset Book as {string} and enter Category as {string} and click on search', async function (book, categoryType) 
{
  await payablesPage.enterTheAssetDetails(categoryType);
});
Then('I should see the Asset details', async function () 
{
  await fixture.page.locator("(//span[contains(text(),'IT Equip')])[1]").waitFor({timeout:20000});
  assert.assertTrue(await fixture.page.locator("(//span[contains(text(),'IT Equip')])[1]").isVisible());
});
When('I select the Asset and click on {string} button', async function (descriptiveDetailsButton:string) 
{
  await fixture.page.getByRole('button', { name: `${descriptiveDetailsButton}` }).click(); 
});
Then('I should see the {string} page with Descriptive Details', async function (changeDescriptiveDetailsHeading:string) 
{
  await fixture.page.locator("//h1[contains(text(),'" + changeDescriptiveDetailsHeading + "')]").waitFor({timeout:20000});
  assert.assertTrue(await fixture.page.locator("//h1[contains(text(),'" + changeDescriptiveDetailsHeading + "')]").isVisible());
});
When('I change the Property Type and Property Class', async function () 
{
  await payablesPage.selectAssetPropertyDetails();
});
Then('I Click on Cancel button', async function ()
{
  await fixture.page.locator("//button[@accesskey='C']").click();
});
Then('I click on No Button in the Warning popup window', async function ()
{
  await fixture.page.locator("//button[@accesskey='N']").click();
});


When('I click on {string} dropdown and select Create', async (option: string) => {
  await fixture.page.locator('(//a[text()="View"])[1]').click()
  await fixture.page.getByRole('menuitem', { name: 'Account Group' }).locator('div').nth(2).click()
  await fixture.page.getByRole('cell', { name: 'Create', exact: true }).click()

})

When('I fill {string} of account Group', async function (title: string) {
  randNum = faker.number.int({ min: 1, max: 1000 })
  batchName = "Test_copy" + randNum
  await fixture.page.getByLabel('Name').fill(batchName)
})

When('I add a new row in PMC section of account group', async function () {
  await payablesPage.addNewRow();
});

When('I click on save dropdown',async function(){
  await fixture.page.getByTitle('Save', { exact: true }).click();
  await fixture.page.getByRole('cell', { name: 'Save and Close', exact: true }).click();
})

When('I create an asset', async() => {
  await payablesPage.optionInTaskPanel("Add Asset");
  assetNum = await payablesPage.createAsset();
})

When('I search for the asset to be modified', async() => {
  await fixture.page.getByRole('combobox', { name: 'Book' }).selectOption("RP_US_CORP");
  await fixture.page.getByRole('textbox', { name: 'Asset Number', exact: true }).fill(assetNum);
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
})

Then('search result will be displayed', async() => {
  await fixture.page.pause();
  await expect(fixture.page.getByRole('cell', { name: `${assetNum}`, exact: true })).toBeVisible({ timeout: 60000 });
})

When('I select the asset and click on {string} button', async(button: string) => {
  await fixture.page.getByRole('cell', { name: 'test', exact: true }).click();
  await fixture.page.getByRole('button', { name: `${button}`, exact: true }).click();
 
})

When('I make Adjustment for Cost', async() => {
  await fixture.page.getByRole('textbox', { name: 'Cost' }).fill('30');
  
})




