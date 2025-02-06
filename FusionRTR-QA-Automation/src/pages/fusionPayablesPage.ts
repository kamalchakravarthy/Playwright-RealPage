import { expect, Page, type Locator } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";
import { fixture } from "../hooks/pageFixture";
import { assert } from "../hooks/hooks";
import { DataTable } from "@cucumber/cucumber";
import { faker } from "@faker-js/faker/locale/en";
//import { faker } from "@faker-js/faker/.";

let processId
let invoiceNumber: string;
let amount: string;
let assetNum: string

export default class fusionPayablesPage {
    private base: PlaywrightWrapper;
    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.base = new PlaywrightWrapper();
    }

    async signInToFusion(role: string) {
        const usernameField: Locator = fixture.page.getByPlaceholder('User ID')
        const pwdField: Locator = fixture.page.getByPlaceholder('Password')

        await usernameField.fill(role)
        await pwdField.fill(process.env.FUSION_PWD)

        await fixture.page.getByRole('button', { name: 'Sign In' }).click()
    }

    async signOutFromFusion() {
        await fixture.page.locator('//img[@title="Settings and Actions"]').click()
        await fixture.page.getByRole('link', { name: 'Sign Out' }).click({ timeout: 10000 })
        await fixture.page.getByRole('button', { name: 'Confirm' }).click({ timeout: 10000 })

        await fixture.page.waitForTimeout(5000)
    }

    async navigateToInvoicesPage(menu: string, section: string) {

        await fixture.page.getByRole('link', { name: 'Navigator' }).click()
        await fixture.page.getByTitle(menu, { exact: true }).click();
        await fixture.page.locator(`//span[text()="${section}"]`).click();

    }

    async validateInvoice() {

        await expect(fixture.page.locator("//span[text()='VERTEX COMMON TAX']")).toBeVisible();
        await expect(fixture.page.locator("//span[text()='VENDOR CHARGED TAX']")).toBeVisible();
        await expect(fixture.page.locator("//span[text()='VTX_VND_CHRD_TAX_JURCD']")).toBeVisible();

    }
    async CheckProcessIDStatus(id) {
        const valueToCheck = id;
        const spans = await fixture.page.locator('span');
        const count = await spans.count();

        let found = false;
        let che = 0;

        for (let i = 0; i < count; i++) {
            const textContent = await spans.nth(i).innerText();
            if (textContent.includes(valueToCheck)) {
                found = true;
                che = i;
                break;
            }
        }
        const tc = await spans.nth(che + 1).innerText();
        const sc = tc.includes("Succeeded");
        return [found, sc];
    }

    async populateProcessParams() {
        await fixture.page.getByRole('combobox', { name: 'Subledger Application	' }).selectOption('Payables');
        await fixture.page.locator('//a[@title="Search: Ledger"]').click()
        await fixture.page.getByRole('cell', { name: 'RP US USD PL' }).getByRole('cell', { name: 'RP US USD PL', exact: true }).filter({ hasText: /^RP US USD PL$/ }).click()
        await fixture.page.getByRole('combobox', { name: 'Accounting Mode' }).selectOption('Draft');
        await fixture.page.getByRole('combobox', { name: 'Process Events' }).selectOption('All');
        await fixture.page.getByRole('combobox', { name: 'Report Style' }).selectOption('Detail');
        await fixture.page.getByRole('combobox', { name: 'Include User Transaction Identifiers' }).selectOption('No');

        await fixture.page.waitForTimeout(2000)
    }

    async assertConfirmationPopupVisibility() {
        const popup = fixture.page.getByText(/Process \d+ was submitted\./)
        await expect(popup).toBeVisible({ timeout: 20000 })

        processId = (await popup.textContent()).split(' ')[1]
        console.log(processId)
    }

    async clickOnProcessLine() {
        const refreshButton = fixture.page.getByRole('button', { name: 'Refresh' })

        await refreshButton.click()

        await expect(fixture.page.getByRole('cell', { name: processId, exact: true })).toBeVisible()

        outer: while (true) {
            await fixture.page.waitForTimeout(2000)
            await refreshButton.click()

            for (let i = Number(processId) + 1; i <= Number(processId) + 30; i++) {
                const processRow = fixture.page.getByRole('cell', {
                    name: new RegExp(
                        `^(${i} Succeeded)` +
                        '.*Create Accounting Execution Report$'
                    )
                }).getByRole('cell', { name: 'Create Accounting Execution Report' })

                if (await processRow.isVisible()) {
                    await fixture.page.waitForTimeout(1000)
                    await processRow.click()
                    break outer
                }
            }
        }
    }
    async clickRepublishButton() {
        await fixture.page.waitForTimeout(3000)
        const popupPromise = fixture.page.waitForEvent('popup');
        const frame = await fixture.page.frameLocator('iframe[id*="processDetails"]')
        frame.getByRole("img", { name: "Republish Online" }).click()
        await fixture.page.waitForTimeout(3000)
        const popup: Page = await popupPromise;
        await popup.waitForLoadState();
        await popup.locator("//a[@title='Actions']").click()
        await fixture.page.waitForTimeout(3000)
        await popup.getByText("Export").click()
        const TabPromise = popup.waitForEvent('popup');
        await popup.getByText("PDF").click()
        await (await TabPromise).waitForLoadState()
        const download = await (await TabPromise).waitForEvent('download')
        const path = await download.path();
        console.log('Downloaded file path:', path);
        console.log(await popup.title());
        await popup.close();
        (await TabPromise).close()
    }

    async invoiceHoldReason() {
        await fixture.page.waitForTimeout(3000)
        await fixture.page.getByRole("combobox", { name: "Name" }).first().click()
        await fixture.page.getByRole("combobox", { name: "Name" }).first().selectOption("Amount ordered")
        await fixture.page.getByRole("combobox", { name: "Name" }).first().click()
        await fixture.page.waitForTimeout(3000)
    }

    async optionInTaskPanel(option: string) {
        await fixture.page.getByRole("img", { name: "Tasks", exact: true }).click()
        await fixture.page.getByRole("link", { name: option, exact: true }).click({ timeout: 30000 })
    }

    async clickButtonInPopup(option: string) {
        await fixture.page.getByRole("button", { name: option, exact: true }).click()
    }

    async searchProcessUsingId(ID: string) {
        await fixture.page.getByRole("button", { name: "Expand Search", exact: true }).click({ timeout: 30000 })
        await fixture.page.getByRole("textbox", { name: "Process ID", exact: true }).fill(ID)
        await fixture.page.getByRole("textbox", { name: "m/d/yy h:mm a z", exact: true }).fill("")
        await fixture.page.getByRole("button", { name: "Search", exact: true }).click({ timeout: 30000 })
        await fixture.page.waitForTimeout(5000)
    }

    async getProcessId() {
        const message = await fixture.page.locator('//label[contains(text(),"submitted")]').innerText()
        const processID = message.match(/\d+/)[0];
        console.log(processID)
        return processID
    }

    async reportDetails(data: DataTable) {
        const details = await data.rowsHash()
        await fixture.page.getByLabel("Bank Account").fill(details['Bank Account'])
        await fixture.page.getByTitle('Search: From Accounting Period').click()
        await fixture.page.getByRole("link", { name: "Search...", exact: true }).click()
        await fixture.page.getByRole("textbox", { name: "PeriodName", exact: true }).fill(details['From Accounting Period'])
        await fixture.page.getByRole("button", { name: "Search", exact: true }).click()
        await fixture.page.getByText(details['From Accounting Period']).nth(1).click()
        await fixture.page.getByRole("button", { name: "OK", exact: true }).click()

        await fixture.page.waitForTimeout(3000)
        await fixture.page.getByTitle('Search: To Accounting Period').click()
        await fixture.page.getByRole("link", { name: "Search...", exact: true }).click()
        await fixture.page.getByRole("textbox", { name: "PeriodName", exact: true }).fill(details['To Accounting Period'])
        await fixture.page.getByRole("button", { name: "Search", exact: true }).click()
        await fixture.page.getByText(details['To Accounting Period']).click()
        await fixture.page.getByRole("button", { name: "OK", exact: true }).click()
    }

    /**This Method used to click on the options in the Navigator */   
async clickOnTheNavigationOptions(navigatorOption:string)
{
  await fixture.page.getByLabel("Navigator").click({timeout:60000})
  await fixture.page.getByTitle(navigatorOption, { exact: true }).click();
}  
/**This Method used to click on the options in the Payable link */  
async clickOnTheOptionsInThePayable(option:string){
  await fixture.page.getByRole('link', { name: option }).click();
  await fixture.page.waitForTimeout(5000)
}
/**This Method used to click on the Invoice page panel */
async clickOnTheTaskPanel(panelName:string){
  await fixture.page.getByRole('link', { name: panelName }).click();
}
/**This Method used to click on the option in the panel */
async clickOnThePanelOptions(panelOption:string){
  await fixture.page.getByRole('link', { name: panelOption, exact:true }).click();
  await fixture.page.waitForTimeout(5000);
}
/**This Method used to fill all the fields to create Invoice */
async enterAllTheDetailsToCreateInvoice(businessUnit:string,supplierName:string):Promise<string>
{
  await fixture.page.getByTitle('Search: Business Unit').click();
  await fixture.page.getByText(businessUnit).click();
  await fixture.page.getByRole('link', { name: 'Search: Supplier' }).click();
  await fixture.page.getByRole('textbox', { name: 'Supplier', exact: true }).fill(supplierName);
  await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
  await fixture.page.getByText('Test BEST Supplier').click();
  await fixture.page.getByRole('button',{name:'OK',exact:true}).click();
  invoiceNumber = "BEST_"+" "+faker.number.int({ min: 1, max: 10000 });
  console.log("Invoice Number is:"+" "+invoiceNumber)
  await fixture.page.getByLabel('Number',{exact:true}).fill(invoiceNumber);
  amount = faker.number.int({ min:10, max:1000 }).toString();
  await fixture.page.getByLabel('Amount', { exact: true }).fill(amount);
  return invoiceNumber;
}
/**This Method used to add line items to the Invoice */
async addLineItemsToTheInvoice(){
  await fixture.page.getByRole('button', { name: 'Expand Lines' }).click();
  await fixture.page.getByRole('table', { name: 'Invoice Lines' }).getByLabel('Amount').fill(amount);
}
/**This Method used to select the Distribution Combination ID values */
async selectDistributionCombinationIDDetails(details:DataTable)
{
  await fixture.page.getByRole('link', { name: 'Select: Distribution Combination ID' }).click();
  await fixture.page.locator("//div[text()='Distribution Combination ID']").waitFor({state:"visible",timeout:20000});
  const values = details.rowsHash();
  await fixture.page.waitForTimeout(5000);
  //await fixture.page.locator("//a[@title='Search: ENTITY']").waitFor({timeout:15000});
  await fixture.page.locator("//a[@title='Search: ENTITY']").click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByText(values['ENTITY']).click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByTitle('Search: ACCOUNT').click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByText(values['ACCOUNT']).click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByTitle('Search: PRODUCT').click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByText(values['PRODUCT']).click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByTitle('Search: COST CENTER').click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByText(values['COST CENTER']).click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByTitle('Search: PROJECT',{exact:true}).click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByText(values['PROJECT']).click();
  await fixture.page.waitForTimeout(2000);
  await fixture.page.getByRole('button',{name:'OK'}).click();
}
/**This Method used to click on the InvoiceActions options */
async clickOnTheInvoiceActionOptions(subLink,invoiceActionsLink)
{
  await fixture.page.getByRole('link', { name: invoiceActionsLink }).click();
  await fixture.page.getByRole('cell', { name: subLink, exact: true }).click();
}
/**This Method used to get the validation status and click on the link */
async verificationOfInvoiceValidationStatus(){
  const validationStatus = await fixture.page.locator("//a[@accesskey='Q']").textContent();
  return validationStatus; 
}
/**This Method used to click on the validation link */
async clickOnTheValidationLink()
{
  await fixture.page.waitForTimeout(5000);
  await fixture.page.locator("//a[@accesskey='Q']").click();
}
/**This Method used to verify the invoice holds */
async verificationOfInvoiceSummary()
{
  await fixture.page.locator("//div[text()='Invoice Summary']").waitFor({timeout:20000});
  assert.assertTrue(await fixture.page.getByRole('link', { name: 'Validated' }).isVisible());
  assert.assertTrue(await fixture.page.getByRole('row', { name: 'Manual Holds Holds0' }).getByRole('img', { name: 'Holds' }).isVisible());
  assert.assertTrue(await fixture.page.getByRole('row', { name: 'System Holds Holds0' }).getByRole('img', { name: 'Holds' }).isVisible());
  //await fixture.page.locator("//td[@class='af_panelWindow_header-close-icon-wrapper']//a[@title='Close']").click();
  await fixture.page.getByRole('link', { name: 'Close', exact: true }).click();
}
/**This Method used to click on the Invoice Action Link */
async clickOnInvoiceActionsLink(){
  await fixture.page.getByRole('link', { name: 'Invoice Actions' }).click();
}
/**This Method used to Initiate the Invoice Approval */
async initiateInvoiceApproval()
{
  await this.clickOnInvoiceActionsLink();
  await fixture.page.getByRole('cell', { name: 'Approval', exact: true }).click();
  await fixture.page.getByRole('cell', { name: 'Initiate', exact: true }).click();
  await this.clickOnInvoiceActionsLink();
  await fixture.page.getByRole('cell', { name: 'View Approval and Notification History', exact: true }).click();
  await fixture.page.getByText('Approval and Notification History', { exact: true }).waitFor({timeout:20000});
  assert.assertTrue(await fixture.page.getByText('Initiated').isVisible())
  await fixture.page.getByRole('button', { name: 'Done' }).click();
}
/**This Method used verify the Invoice Approval Status in Invoice Summary */
async verifyInvoiceApprovalStatus(){
  await fixture.page.locator("//a[@accesskey='Q']").click();
  await fixture.page.waitForTimeout(2000);
  const status = await fixture.page.locator("//span[text()='Initiated']").textContent();
  return status;
}
/**This Method used to search for created invoice */
async invoiceSearch()
{
  await fixture.page.getByRole('link', { name: 'Search: Invoices' }).click();
  await fixture.page.getByLabel('Invoice Number').click();
  await fixture.page.getByLabel('Invoice Number').fill(`${invoiceNumber}`);
  await fixture.page.getByRole('button', { name: 'Search' }).click();
}
/**This Method used to verify the created Invoice available in the search results */
async verifyTheInvoice()
{
  await fixture.page.getByRole('link', { name: 'Search Results' }).waitFor({timeout:15000});
  assert.assertTrue(await fixture.page.getByRole('link', { name: 'Search Results' }).isVisible());
  assert.assertTrue(await fixture.page.getByRole('heading', { name: 'Search: Invoice' }).isVisible());
  const bool = await fixture.page.getByRole('cell', { name: `${invoiceNumber}` }).isVisible();
  return bool;
}
    async createAssetInvoice(data: DataTable) {

        const details = data.rowsHash()


        await fixture.page.getByTitle('Search: Business Unit').click()
        await fixture.page.getByText(details['Business Unit']).first().click();
        await fixture.page.getByLabel('Supplier', { exact: true }).click();
        await fixture.page.getByLabel('Supplier', { exact: true }).fill(details['Supplier']);
        const randomDigits = Math.floor(Math.random() * (1000 - 10 + 1)) + 10;
        const invoiceNum = `RP@${randomDigits}`;
        console.log("Invoice Number: ", invoiceNum);
        await fixture.page.getByLabel('Number').fill(invoiceNum);
        await fixture.page.getByLabel('Number').fill(invoiceNum);
        const invoiceAmount = Math.floor(Math.random() * 500);
        await fixture.page.getByLabel('Amount', { exact: true }).fill(`${invoiceAmount}`);
        await fixture.page.getByRole('button', { name: 'Expand Lines' }).click();
        await fixture.page.getByRole('table', { name: 'Invoice Lines' }).getByLabel('Amount').fill(`${invoiceAmount}`);
        await fixture.page.getByLabel('Distribution Combination ID').click();
        await fixture.page.getByLabel('Distribution Combination ID').fill(details['Distribution Combination']);

        return invoiceNum;
    }
/**This Method used to search the created Invoice */
    async searchInvoice(invoiceNum: string){
        await fixture.page.locator('//img[@title="Search: Invoices"]').click({timeout:30000});
        await fixture.page.getByRole("textbox",{name:'Invoice Number',exact:true}).fill(`${invoiceNum}`);
        await fixture.page.locator("//button[text()='Search']").last().click({timeout:30000});
    }
    /**This Method used to enter the required details to search an Assets */
    async enterTheAssetDetails(categoryType:string)
    {
      await fixture.page.getByRole('combobox', { name: 'Book' }).selectOption('5');
      await fixture.page.getByLabel('Category').click();
      await fixture.page.getByLabel('Category').fill(`${categoryType}`);
      await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
    }
    /**This Method used to select Property Type and Property Class in Change Descriptive Details Page */
    async selectAssetPropertyDetails()
    {
      await fixture.page.getByRole('combobox', { name: 'Property Type' }).selectOption('2');
      await fixture.page.getByRole('combobox', { name: 'Property Class' }).selectOption('2');
    }

    async addNewRow() {
        await fixture.page.getByRole('button', { name: 'Add Row' }).click();
        await fixture.page.getByTitle('Search: Ledger').click();
        await fixture.page.locator('span').filter({ hasText: /^RP US USD PL$/ }).click();
        await fixture.page.getByTitle('Search: ENTITY').click();
        await fixture.page.getByRole('cell', { name: '101', exact: true }).click();
        await fixture.page.getByTitle('Search: ACCOUNT').click();
        await fixture.page.getByRole('cell', { name: '101008' }).nth(1).click();
        await fixture.page.getByTitle('Search: PRODUCT').click();
        await fixture.page.getByRole('cell', { name: '00000-Default Product', exact: true }).click();
        await fixture.page.getByTitle('Search: COST CENTER').click();
        await fixture.page.getByRole('cell', { name: '000000-Default Cost Center', exact: true }).click();
        await fixture.page.getByTitle('Search: INTERCO').click();
        await fixture.page.getByRole('cell', { name: '000-Default Interco', exact: true }).click();
        await fixture.page.getByTitle('Search: PROJECT').click();
        await fixture.page.getByRole('cell', { name: '0000-Default Project', exact: true }).click();
        await fixture.page.getByTitle('Search: FUTURE').click();
        await fixture.page.getByRole('cell', { name: '00000000-Default Future', exact: true }).click();
        await fixture.page.getByRole('combobox', { name: 'Change' }).selectOption("Not Equal")
        await fixture.page.getByLabel('Threshold').fill('0');
    }

    async createAsset() {
    await fixture.page.getByRole('combobox', { name: 'Book' }).selectOption("RP_US_CORP");
    await fixture.page.getByRole('link', { name: 'Select: Category' }).click({ timeout: 30000 });
    await fixture.page.getByRole('button', { name: 'Search' }).click({ timeout: 30000 })
    await fixture.page.getByRole('row', { name: 'IT Equip Computer Accessories' }).click({ timeout: 6000 })
    await fixture.page.keyboard.press('Tab')
    await fixture.page.getByRole('button', { name: 'OK', exact: true }).click({ timeout: 30000 });
    await fixture.page.locator('role=combobox[name="Description"]').click();
    await fixture.page.locator('role=combobox[name="Description"]').fill('test');
    await fixture.page.keyboard.press('Tab')
    await fixture.page.getByRole('link', { name: 'Select: Location' }).click({ timeout: 6000 });
    await fixture.page.getByRole('button', { name: 'Search' }).click({ timeout: 6000 })
    await fixture.page.getByRole('row', { name: 'India Hyderabad Mdhapr Hyderabad IN None 10F-Mindspace Cyberabad' }).getByText('India').click({ timeout: 6000 });
    await fixture.page.keyboard.press('Tab')
    await fixture.page.getByRole('button', { name: 'OK', exact: true }).click({ timeout: 6000 });
    await fixture.page.getByRole('button', { name: 'Next', exact: true }).click({ timeout: 6000 });
    let randNum = faker.number.int({ min: 1, max: 2000 })
    assetNum = String(randNum);
    console.log("Asset no:", assetNum);
    await fixture.page.getByLabel('Asset Number', { exact: true }).fill(assetNum)
    await fixture.page.keyboard.press('Tab')
    await fixture.page.getByRole('textbox', { name: 'Cost' }).fill('50')
    await fixture.page.keyboard.press('Tab')
    await fixture.page.getByRole('link', { name: 'Select: Asset Key' }).click({ timeout: 30000 })
    await fixture.page.getByRole('button', { name: 'Search' }).click()
    await fixture.page.getByRole('cell', { name: 'RP', exact: true }).click({ timeout: 30000 })
    await fixture.page.getByRole('button', { name: 'OK' }).click({ timeout: 30000 });
    await fixture.page.getByTitle('Save and Close').click({ timeout: 30000 });
    await fixture.page.getByText('Save', { exact: true }).click({ timeout: 30000 });
    await fixture.page.getByRole('button', { name: 'OK' }).click({ timeout: 30000 });
    await fixture.page.getByRole('button', { name: 'Submit' }).click({ timeout: 30000 });
    return assetNum;
  }

  async clickOnButton(button: string) {
    await fixture.page.getByRole('button', { name: button, exact: true }).click({ timeout: 20000 })
    await fixture.page.waitForTimeout(3000)
  }

  async inquireAsset() {
    await fixture.page.getByRole('combobox', { name: 'Book' }).selectOption("RP_US_CORP");
    await fixture.page.getByLabel('From Asset').fill(assetNum);
    await this.clickOnButton('Advanced')
    await fixture.page.getByRole('combobox', { name: 'Transaction Number Operator', exact: true }).selectOption('=');
    await fixture.page.getByRole('combobox', { name: 'Transaction Type', exact: true }).selectOption('Addition');
    await this.clickOnButton('Search')
    await fixture.page.getByRole('cell', { name: 'Addition' }).nth(0).click();
    await this.clickOnButton('View Accounting')
    await fixture.page.getByRole('cell', { name: 'Accounting Lines' }).getByRole('button', { name: 'Done' }).click()
    await fixture.page.getByRole('cell', { name: 'Asset Inquiry Help Done' }).getByRole('button', { name: 'Done' }).click()
  }

}
