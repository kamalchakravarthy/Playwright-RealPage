import { expect, Page, type Locator } from "@playwright/test";
import PlaywrightWrapper from "../../helper/wrapper/PlaywrightWrappers";
import { fixture } from "../../hooks/pageFixture";
import { faker } from "@faker-js/faker/locale/en";
import { assert } from "../../hooks/hooks";
import { DataTable } from "@cucumber/cucumber";
import Assert from "../../helper/wrapper/assert";
let randomNumber;
let locator;
let transactionNumber;
let transactionAmount
let contactName;
let transactionSearchResults;
let adjustmentReason;
let adjustmentType;
let processnum;
let disputeAmt;
let receiptAmount;
let receiptNumber;

export default class otc_ReceivablesPage {


  private base: PlaywrightWrapper;
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    this.base = new PlaywrightWrapper();
  }

  async createTransaction(data: DataTable) {
    await fixture.page.locator("//a[@title='Navigator']").click();
    await fixture.page.locator('//div[@title = "Receivables"]').click();
    await fixture.page.getByRole('link', { name: "Billing" }).click();
    await fixture.page.locator("//img[@title='Tasks']").click();
    await fixture.page.getByRole('link', { name: "Create Transaction" }).click();
    transactionAmount = faker.number.int({ min: 1, max: 10000 });
    const details = data.rowsHash();
    await fixture.page.locator("//input[@aria-label='Business Unit']").fill(details['Business Unit'])
    await fixture.page.locator("//input[@aria-label='Transaction Source']").fill(details['Transaction Source'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(1000)
    await fixture.page.locator("//input[@aria-label='Transaction Type']").fill(details['Transaction Type'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(1000)
    if (details['Invoicing Rule'] === "In Arrears") {
      await fixture.page.getByRole("combobox", { name: "Invoicing Rule" }).selectOption({ value: "In Arrears" })
    }
    else if (details['Invoicing Rule'] === "In Advance") {
      await fixture.page.getByRole("combobox", { name: "Invoicing Rule" }).selectOption({ value: "In Advance" })
    }
    await fixture.page.getByLabel("Bill-to Name").fill(details['Bill-to Name'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.getByLabel("Ship-to Site").fill(details['Ship-to Site'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.locator("(//input[contains(@id, 'descriptionId')])[1]").fill(details['Description'])
    await fixture.page.locator("(//input[contains(@id, 'quantity')])[1]").fill(details['Quantity'])
    await fixture.page.locator("(//input[contains(@id, 'Price')])[1]").fill(String(transactionAmount))
    await fixture.page.locator("//a//span[contains(text(), 'Save')]").click()
    locator = fixture.page.locator("//div[contains(@title,'Edit Transaction: Invoice')]")
    await expect(locator).toBeVisible({ timeout: 80000 })
    assert.assertTrue(locator.isVisible())
    const textContent = await locator.textContent();
    transactionNumber = textContent?.match(/Invoice\s(\d+)/)[1];
    console.log(transactionNumber);
    await fixture.page.locator('//a[@title = "Complete and Create Another"]').click()
    await fixture.page.locator('//td[contains(text() ,"Complete and Close")]').click()
    expect(await fixture.page.locator(`//div[contains(text(),'Transaction ${transactionNumber} has been completed.')]`).isVisible({ timeout: 60000 }))
    await fixture.page.getByRole("button", { name: "OK" }).click();
    return [transactionNumber, transactionAmount];
  }

  async signInToFusion(username: string) {
    // if (!(await fixture.page.getByRole('button', { name: 'Sign In' }).isVisible())) {
    //   await this.signOutFromFusion()
    // }

    await fixture.page.getByLabel("User ID").fill(username)
    await fixture.page.getByLabel("Password").fill(process.env.PASSWORD)
    await fixture.page.getByRole("button", { name: "Sign In" }).click()
  }

  async signOutFromFusion() {
    await fixture.page.locator("//a[@title='Settings and Actions']").click({ timeout: 60000 })
    await fixture.page.waitForTimeout(4000)
    await fixture.page.getByRole("link", { name: "Sign Out" }).click({ timeout: 20000 })
    await fixture.page.waitForTimeout(3000);
    if (await fixture.page.locator("//div[text()='You have not saved your changes. If you sign out of this session, your changes will be lost. Do you want to continue?']").isVisible()) {
      await fixture.page.getByRole('button', { name: 'Yes' }).click();
    }
    await fixture.page.getByRole("button", { name: "Confirm" }).click({ timeout: 8000 })
    await fixture.page.waitForTimeout(5000)
  }

  async setContactResponsibilities(lovValue: string, dropdown: string, dValue: string, button: string) {
    await fixture.page.selectOption("(//select[@class='x2h'])[6]", lovValue);
    await fixture.page.locator(`(//a[text()='${dropdown}'])[6]`).click();
    await fixture.page.locator(`//td[text()='${dValue}']`).click();

    await this.clickOnButton(button)
  }

  async clickOnButton(button: string) {
    await fixture.page.getByRole('button', { name: button }).click();
  }

  async clickOnTab(tab: string) {
    await fixture.page.getByRole('link', { name: tab }).click();
  }

  async reviewComboBoxOptions(option: string) {
    try {
      const comboboxInputLocator = fixture.page.getByRole('combobox', { name: option });
      await expect(comboboxInputLocator).toBeVisible({ timeout: 15000 });
      const inputValue = await comboboxInputLocator.inputValue();
      await expect(inputValue).not.toBe('');
      // Assert that the input value is not empty   
      console.log(`Current input value: "${inputValue}"`);
    }
    catch (error) {
      console.error('Error during verification of Collector combobox:', error);
    }
  }

  async reviewCheckBoxOption(checkboxName: string) {
    try {
      const checkboxLocator = fixture.page.getByRole('checkbox', { name: "Send dunning letter" });
      await expect(checkboxLocator).toBeVisible({ timeout: 15000 });
      const isChecked = await checkboxLocator.isChecked();

      console.log(`Checkbox "${checkboxName}" is checked: ${isChecked}`);
    } catch (error) {
      console.error(`Error during verification of checkbox "${checkboxName}":`, error);
    }
  }

  async selectOrganization(organizationName) {
    await fixture.page.getByLabel('Organization Name').click();
    await fixture.page.getByLabel('Organization Name').fill("Jmg Realty, Inc.");
    await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
  }
  async searchingProcessDetails(option: string) {
    if (option === "Collections Delinquency Management") {
      await fixture.page.getByLabel('Name').click({ timeout: 60000 });
      await fixture.page.getByLabel('Name').fill(option, { timeout: 60000 });
      await fixture.page.getByLabel('Name').press('Enter', { timeout: 60000 });
      await fixture.page.getByRole('button', { name: 'OK' }).click({ timeout: 60000 });
    }
    else {
      await fixture.page.locator(`//a[@title="Search: Name"]`).click();
      await fixture.page.getByRole('link', { name: "Search..." }).click({ timeout: 60000 });
      await fixture.page.locator("//input[@aria-label=' Name']").fill(option);
      await fixture.page.locator("//button[text()='Search']").click({ timeout: 60000 });
      await fixture.page.getByRole("row", { name: "Populates summary tables after a set of data is migrated or corrected." }).last().click({ timeout: 60000 });
      await fixture.page.getByRole('button', { name: 'OK' }).last().click({ timeout: 60000 });
    }
  }

  /**This Method used to search and select the schedule process option */
  async searchAndSelectName(scheduleOption: string) {
    await fixture.page.getByTitle('Search: Name').click();
    await fixture.page.getByRole('link', { name: 'Search...' }).click();
    await fixture.page.getByRole('textbox', { name: 'Name' }).click();
    await fixture.page.getByRole('textbox', { name: 'Name' }).fill(`${scheduleOption}`);
    await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
    await fixture.page.waitForTimeout(2000)
    //await fixture.page.getByText(`${scheduleOption}`, { exact: true }).click();
    await fixture.page.getByRole('cell', { name: 'Search and Select: Name Close This table contains column headers corresponding to the data body table below This table contains column headers corresponding to the data body table below Collections Scoring and Strategy Assignment The Collections Scoring and Strategy Assignment process calculates scores for customers and assigns strategy to customers based on the scoring and strategy assignment setup. OK Cancel' }).getByText('Collections Scoring and Strategy Assignment', { exact: true }).click();
    await fixture.page.locator("(//td[@class='x1pn']//button[text()='OK'])[2]").click({ timeout: 60000 });
  }
  /**This method used to enter the details and submit the schedule process */
  async enterTheScheduleProcessDetailsInTheProcessDetailsPage(data: DataTable) {
    const processDetails = data.rowsHash();
    await fixture.page.getByRole('combobox', { name: 'Business Unit' }).selectOption('5');
    await fixture.page.getByRole('combobox', { name: 'Allow Strategy to Change' }).selectOption('2');
    await fixture.page.getByLabel('Assign Strategy from Customer Name').click();
    await fixture.page.getByRole('link', { name: 'Search: Assign Strategy from Customer Name' }).click();
    await fixture.page.getByRole('textbox', { name: 'Name', exact: true }).click();
    await fixture.page.getByRole('textbox', { name: 'Name', exact: true }).fill(processDetails['Assign Strategy from Customer Name']);
    await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByText(processDetails['Assign Strategy from Customer Name']).click();
    await fixture.page.getByRole('button', { name: 'OK' }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole('link', { name: 'Search: To Customer Name' }).click();
    await fixture.page.getByRole('textbox', { name: 'Name', exact: true }).click();
    await fixture.page.getByRole('textbox', { name: 'Name', exact: true }).fill(processDetails['To Customer Name']);
    await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByText(processDetails['To Customer Name']).click();
    await fixture.page.getByRole('button', { name: 'OK' }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole('link', { name: 'Search: Assign Strategy from Customer Account Number' }).click();
    await fixture.page.getByRole('textbox', { name: 'Account Number', exact: true }).click();
    await fixture.page.getByRole('textbox', { name: 'Account Number', exact: true }).fill(processDetails['Assign Strategy from Customer Account Number']);
    await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByText(processDetails['Assign Strategy from Customer Account Number']).click();
    await fixture.page.getByRole('button', { name: 'OK' }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole('link', { name: 'Search: To Customer Account Number' }).click();
    await fixture.page.getByRole('textbox', { name: 'Account Number', exact: true }).click();
    await fixture.page.getByRole('textbox', { name: 'Account Number', exact: true }).fill(processDetails['To Customer Account Number']);
    await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByText(processDetails['To Customer Account Number']).click();
    await fixture.page.getByRole('button', { name: 'OK' }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole('link', { name: 'Search: Assign Strategy from Bill-to Site Location' }).click();
    await fixture.page.getByRole('textbox', { name: 'Bill-to Site Location', exact: true }).click();
    await fixture.page.getByRole('textbox', { name: 'Bill-to Site Location', exact: true }).fill(processDetails['Assign Strategy from Bill-to Site Location']);
    await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByText(processDetails['Assign Strategy from Bill-to Site Location']).click();
    await fixture.page.getByRole('button', { name: 'OK' }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole('link', { name: 'Search: To Bill-to Site Location' }).click();
    await fixture.page.getByRole('textbox', { name: 'Bill-to Site Location', exact: true }).click();
    await fixture.page.getByRole('textbox', { name: 'Bill-to Site Location', exact: true }).fill(processDetails['To Bill-to Site Location']);
    await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByText(processDetails['To Bill-to Site Location']).click();
    await fixture.page.getByRole('button', { name: 'OK' }).click();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole('button', { name: 'Submit', exact: true }).click();
  }

  async createDebitMemo(data: DataTable) {
    randomNumber = faker.number.int({ min: 1, max: 10000 });
    const details = data.rowsHash();
    await fixture.page.getByLabel("Transaction Class").click();
    await fixture.page.getByLabel("Transaction Class").selectOption('Debit memo');
    await fixture.page.waitForTimeout(2000)
    await fixture.page.locator("//input[@aria-label='Transaction Source']").fill(details['Transaction Source'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(2000)
    await fixture.page.locator("//input[@aria-label='Transaction Type']").fill(details['Transaction Type'])
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByLabel("Bill-to Name").fill(details['Bill-to Name'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByLabel("Ship-to Site").fill(details['Ship-to Site'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(2000)
    await fixture.page.locator("(//input[contains(@id, 'descriptionId')])[1]").fill(details['Description'])
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole("textbox", { name: "Quantity" }).first().fill(details['Quantity'])
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole("textbox", { name: "Unit Price" }).first().fill(String(randomNumber))
    await fixture.page.waitForTimeout(2000)
  }

  async saveAndCloseTransaction() {
   await fixture.page.locator("//a[@title='Save']").click();
    await fixture.page.getByText('Save and Close', { exact: true }).click({timeout:20000});
    
  }

  async assertTransactionCreation() {
    await fixture.page.waitForTimeout(3000)
    await expect(fixture.page.getByText(/Transaction \d+ has been saved\./)).toBeVisible({ timeout: 20000 })
    await this.clickOnButton('OK')
  }

  async fillContactDetailsOfCustomerContact(dataTable: DataTable) {
    const data = dataTable.rowsHash()
    contactName = data['First Name'] + " " + data['Last Name']

    await fixture.page.waitForTimeout(2000)
    await fixture.page.locator('(//input[@class="x25"])[1]').fill(data['First Name']);
    await fixture.page.locator('(//input[@class="x25"])[2]').fill(data['Last Name']);
    await fixture.page.locator('(//select[@class="x2h"])[4]').selectOption(data['Job Title Code']);
  }

  async assertUpdationOfCustomerMailDetails(mailId: string) {
    await expect(fixture.page.locator(`//a[text()='${mailId}']`)).toBeVisible({ timeout: 10000 })
  }

  async assertUpdationOfCustomerContactDetails() {
    await expect(fixture.page.getByText(contactName)).toBeVisible({ timeout: 10000 })

  }

  async creditTransaction(orgTransac: string) {
    await fixture.page.getByLabel('Number').fill(orgTransac)
    await fixture.page.keyboard.press('Enter')

    await fixture.page.getByRole('row', { name: /^Line/ }).getByLabel('Credit Percentage').fill('10')
    await fixture.page.keyboard.press('Tab')

    await this.clickOnButton('Complete and Close')

    const confirmMsg = fixture.page.getByText(/Transaction \d+ has been completed\./)
    await expect(confirmMsg).toBeVisible({ timeout: 20000 })
    const creditTransacNum = (await confirmMsg.textContent()).split(' ')[1]
    console.log(creditTransacNum)
    await this.clickOnButton('OK')

    return creditTransacNum
  }

  async unapplyApplicationInCreditMemo() {
    await fixture.page.getByRole('row', { name: 'Actions View' }).getByRole('link', { name: 'Actions' }).click()
    await fixture.page.getByRole('cell', { name: 'Unapply Application' }).nth(3).click()
    await this.clickOnButton('OK')
  }

  async assertUnapplication() {
    await expect(fixture.page.getByText('The accounting has been completed.')).toBeVisible({ timeout: 10000 })
  }

  async assertDisplayOfAccountingLinesWindow() {
    await expect(fixture.page.getByText(/Accounting Lines: Credit Memo/)).toBeVisible({ timeout: 10000 })

    await this.clickOnButton('Done')
    await this.clickOnButton('Save and Close')
  }

  async assertRowDeletionInCreditMemo() {
    await expect(fixture.page.getByText('No data to display.')).toBeVisible()
  }
  /**This method used to search the transactions based on the transaction source */
  async searchingTheTransactions(transactionSource: string) {
    await fixture.page.getByTitle('Search:  Transaction Source').click();
    await fixture.page.getByText(`${transactionSource}`).first().click();
    await fixture.page.waitForTimeout(3000)
  }
  /**This Method used to verify the tabs in the journal entries page */
  async verifyJournalEntriesTabs(tabs: DataTable) {
    let tabNames = tabs.raw();
    for (let i = 0; i < tabNames.length; i++) {
      console.log("Checking for: " + tabNames[i][0]);
      let bool = await fixture.page.getByRole('link', { name: `${tabNames[i][0]}` }).isVisible();
      console.log("Checking for: " + bool);
      assert.assertTrue(bool);
    }
  }
  /**This Method used to enter the data to fetch the journal entries */
  async enterTheJournalEntriesSearchFields(ledger: string, source: string) {
    await fixture.page.getByTitle('Search:  Ledger').click();
    await fixture.page.getByText(`${ledger}`).first().click();
    await fixture.page.waitForTimeout(2000);
    await fixture.page.getByTitle('Search:  Journal Source').click();
    await fixture.page.getByText(`${source}`).first().click();
    await fixture.page.waitForTimeout(2000);
  }
  /**This Method used to select the transaction from the search results in journal entries page */
  async selectTransactionFromSearchResults(): Promise<Map<string, string>> {
    transactionSearchResults = new Map<string, string>();
    await fixture.page.locator("//span[text()='Accounting Date']//following::table[@summary='Search Results']/tbody/tr").first().waitFor({ timeout: 15000 });
    const searchResultsCount = await fixture.page.locator("//span[text()='Accounting Date']//following::table[@summary='Search Results']/tbody/tr").count();
    console.log("Search Results are" + " " + searchResultsCount)
    if (searchResultsCount > 0) {
      await fixture.page.locator("(//span[text()='Accounting Date']//following::table[@summary='Search Results'])[1]/tbody/tr[1]/td/div/table/tbody/tr[1]/td[1]/span").click();
      const accountingDate = await fixture.page.locator("(//span[text()='Accounting Date']//following::table[@summary='Search Results'])[1]/tbody/tr[1]/td/div/table/tbody/tr[1]/td[1]/span").textContent();
      const transactionNumber = await fixture.page.locator("(//span[text()='Accounting Date']//following::table[@summary='Search Results'])[1]/tbody/tr[1]/td/div/table/tbody/tr[1]/td[2]/span").textContent();
      const journalCategory = await fixture.page.locator("(//span[text()='Accounting Date']//following::table[@summary='Search Results'])[1]/tbody/tr[1]/td/div/table/tbody/tr[1]/td[3]/span").textContent();
      const status = await fixture.page.locator("(//span[text()='Accounting Date']//following::table[@summary='Search Results'])[1]/tbody/tr[1]/td/div/table/tbody/tr[1]/td[4]/span").textContent();
      const entryDescription = await fixture.page.locator("(//span[text()='Accounting Date']//following::table[@summary='Search Results'])[1]/tbody/tr[1]/td/div/table/tbody/tr[1]/td[5]/span").textContent();
      const eventClass = await fixture.page.locator("(//span[text()='Accounting Date']//following::table[@summary='Search Results'])[1]/tbody/tr[1]/td/div/table/tbody/tr[1]/td[6]/span").textContent();
      const eventType = await fixture.page.locator("(//span[text()='Accounting Date']//following::table[@summary='Search Results'])[1]/tbody/tr[1]/td/div/table/tbody/tr[1]/td[7]/span").textContent();
      transactionSearchResults.set("Accounting Date", accountingDate);
      transactionSearchResults.set("Transaction Number", transactionNumber);
      transactionSearchResults.set("Journal Category", journalCategory);
      transactionSearchResults.set("Status", status.trim());
      transactionSearchResults.set("Entry Description", entryDescription);
      transactionSearchResults.set("Event Class", eventClass);
      transactionSearchResults.set("Event Type", eventType);
    }
    return transactionSearchResults;
  }
  /**This Method used to verify the journal summary values */
  async verificationOfJournalEntryDetails(ledger: string) {
    await fixture.page.waitForTimeout(3000);
    let value = await fixture.page.locator("//label[text()='Ledger']//following::td").first().isVisible();
    assert.assertTrue(value);
    const actualEntryDescription = await fixture.page.locator("//label[text()='Entry Description']//following::td").first().textContent();
    await assert.assertEquals(transactionSearchResults.get("Entry Description"), actualEntryDescription);
    const actualAccountingDate = await fixture.page.locator("//tr[@class='xk6 p_AFReadOnly']//label[text()='Accounting Date']//following::td").first().textContent();
    await assert.assertEquals(transactionSearchResults.get("Accounting Date"), actualAccountingDate);
    const actualJournalCategory = await fixture.page.locator("//label[text()='Journal Category']//following::td[text()='Sales Invoices']").textContent();
    await assert.assertEquals(transactionSearchResults.get("Journal Category"), actualJournalCategory);
    assert.assertTrue(await fixture.page.getByRole("heading", { name: "Lines" }).isVisible());
  }

  /**This Method used to verify the Transaction Summary details */
  async verificationOfTransactionSummaryTabDetails(businessUnit:string)
  {
    const entryDescription = transactionSearchResults.get("Entry Description");
    const regex = /Customer Name: (.+?) Customer Number: (\w+) Bill-To Site: (\d+)/;
    const match = entryDescription.match(regex);
    if (match) {
      const customerName = match[1];
      const customerNumber = match[2];
      const billToSite = match[3];
      console.log(`Customer Name: ${customerName}`);
      console.log(`Customer Number: ${customerNumber}`);
      console.log(`Bill-To Site: ${billToSite}`);
      const name = await fixture.page.locator("//label[text()='Customer Name']//following::td").first().textContent();
      assert.assertEquals(name,"Jmg Realty, Inc.");
      const number = await fixture.page.locator("//label[text()='Customer Number']//following::td").first().textContent();
      assert.assertEquals(number, customerNumber);
      const business = await fixture.page.locator("//label[text()='Business Unit']//following::td").first().textContent();
      assert.assertEquals(business, businessUnit);
      const expectedInvoiceNumber = transactionSearchResults.get("Transaction Number");
      const actualValue = await fixture.page.locator("//label[text()='Invoice Number']//following::td").first().textContent();
      assert.assertEquals(actualValue, expectedInvoiceNumber);
      assert.assertTrue(await fixture.page.locator("//label[text()='Batch Source']//following::td[contains(text(),'Manual')]").isVisible());
      const expectedTransactionType = transactionSearchResults.get("Event Class");
      const transactionType = await fixture.page.locator("//label[text()='Transaction Type']//following::td").first().textContent();
      assert.assertEquals(transactionType, expectedTransactionType);
    }
    else {
      console.log("No match found.");
    }

  }

  async fillingDetailsInCreateAdjustmentWindow(receivablesActivity: string, adjustmentType: string, adjustmentAmount: string) {
    await fixture.page.getByRole('button', { name: 'Create' }).click({ timeout: 60000 });
    await fixture.page.getByTitle('Search: Receivables Activity').click({ timeout: 60000 });
    await fixture.page.locator(`//span[text()='${receivablesActivity}']`).last().click({ timeout: 60000 });
    await fixture.page.getByRole('combobox', { name: 'Adjustment Type' }).selectOption('1');
    await fixture.page.getByLabel('Adjustment Amount').click({ timeout: 60000 });
    await fixture.page.getByLabel('Adjustment Amount').fill(adjustmentAmount);
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  async createReceipt(datatable: DataTable) {
    const data = datatable.rowsHash();
    const dropdown = await fixture.page.locator('select.x2h[title="Standard"]');

    const min = 10000;
    const max = 99999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    let str: string = randomNumber.toString();
    console.log(str);
    await dropdown.selectOption({ value: '1' });
    await fixture.page.waitForTimeout(2000);
    await fixture.page.locator(`//input[@aria-label="Business Unit"]`).click();
    await fixture.page.locator(`//td[text()="${data['Business Unit']}"]`).click();
    await fixture.page.waitForTimeout(10000);
    await fixture.page.locator(`//a[@title="Search: Receipt Method"]`).click({ timeout: 20000 });
    await fixture.page.locator(`//span[text()="${data['Receipt Method']}"]`).click();
    await fixture.page.waitForTimeout(2000);
    await fixture.page.locator(`//input[@aria-label="Receipt Number"]`).fill(str);
    await fixture.page.locator(`//a[@title="Search: Receivables Activity"]`).click({ timeout: 20000 });
    await fixture.page.waitForTimeout(2000);
    await fixture.page.locator(`//span[text()="${data['Receivables Activity']}"]`).first().click();
    await fixture.page.locator(`//input[@aria-label="Entered Amount"]`).fill(data['Entered Amount']);
    await fixture.page.waitForTimeout(2000);
  }

  async createNewAdjustment(dataTable: DataTable) {

    const data = dataTable.rowsHash()
    await fixture.page.getByRole('img', { name: 'Create', exact: true }).click({ timeout: 20000 });
    await fixture.page.locator("//a[@title='Search: Receivables Activity']").click({ timeout: 20000 });
    await fixture.page.getByRole('cell', { name: data['Receivables Activity'] }).last().click({ timeout: 20000 });
    adjustmentType = fixture.page.getByRole('combobox', { name: 'Adjustment Type' });
    await adjustmentType.selectOption(`${data['Adjustment Type']}`);
    await fixture.page.getByRole('textbox', { name: 'Adjustment Amount' }).fill(data['Adjustment Amount']);

    adjustmentReason = fixture.page.getByRole('combobox', { name: 'Adjustment Reason' });
    await adjustmentReason.selectOption(`${data['Adjustment Reason']}`);

    await fixture.page.waitForTimeout(2000);
    await fixture.page.locator("//button[@title='Save']").click({ timeout: 20000 });

  }

  async searchTransaction(transactionNumber: string, button: string) {

    await fixture.page.getByRole("textbox", { name: "m/d/yy" }).first().fill("2/6/25");
    await fixture.page.waitForTimeout(2000);
    await fixture.page.getByRole("textbox", { name: "m/d/yy" }).nth(1).fill("2/6/25");

    await fixture.page.locator("//label[contains(text(),'Include current')]").click({ timeout: 10000 });
    await fixture.page.locator("//label[contains(text(),'Include closed')]").click({ timeout: 10000 });
    await fixture.page.locator("//img[@title='Search']").click({ timeout: 10000 });

    await fixture.page.locator(`//span[text()='${transactionNumber}']`).click({ timeout: 10000 });
    await fixture.page.waitForSelector(`//span[text()='${button}']`, { timeout: 50000 });
    await fixture.page.locator(`//span[text()='${button}']`).click({ force: true });
  }

  async createAdjustments(data: DataTable) {
    const details = data.rowsHash()
    await fixture.page.locator('//a[@title = "Search: Receivables Activity"]').click()
    await fixture.page.getByText(details['Receivables Activity']).first().click()
    console.log(details['Adjustment Type'])
    await fixture.page.getByRole("combobox", { name: "Adjustment Type" }).selectOption(details['Adjustment Type'])

    await fixture.page.waitForTimeout(2000)
  }
  async checkProcessIdStatus(id) {
    const valueToCheck = id;
    const spans = await fixture.page.locator('span');
    const count = await spans.count();
    console.log(count);

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
  async accountDetails(dataTable: DataTable) {
    const rows = dataTable.rows()
    await fixture.page.waitForTimeout(2000)
    for (const row of rows) {
      const value = row[0];
      console.log(value)
      await fixture.page.waitForTimeout(2000);
      await expect(fixture.page.locator(`//span[text()='${value}']`)).toBeVisible();
    }

  }
  async selectNewProfileClass(profileClass: string, profileClass2: string) {
    const locator = await fixture.page.locator('//input[contains(@id, "profileClassId")]');

    const inputValue = await locator.inputValue();
    console.log(inputValue);

    if (inputValue == "TEST_Enterprise") {
      console.log("smb");
      await fixture.page.locator(`//a[@title="ProfileClassId"]`).click({ timeout: 10000 })
      await fixture.page.locator(`//span[text()="${profileClass2}"]`).first().click();
    }
    else {
      console.log("enterprise");
      await fixture.page.locator(`//a[@title="ProfileClassId"]`).click({ timeout: 10000 });
      console.log("coming here");
      await fixture.page.locator(`//span[text()="${profileClass}"]`).first().click();
    }
  }



  async searchandName(scheduleOption: string) {
    await fixture.page.getByTitle('Search: Name').click();
    await fixture.page.getByRole('link', { name: 'Search...' }).click();
    await fixture.page.getByRole('textbox', { name: 'Name' }).click();
    await fixture.page.getByRole('textbox', { name: 'Name' }).fill(`${scheduleOption}`);
    await fixture.page.getByRole('button', { name: 'Search', exact: true }).click();
    await fixture.page.waitForTimeout(2000)

    const rowName = scheduleOption;
    const row = await fixture.page.getByRole("row", { name: rowName }).last();
    await row.click({ timeout: 60000 });

    await fixture.page.locator("(//td[@class='x1pn']//button[text()='OK'])[2]").click({ timeout: 60000 });


  }
  async ProcessDetails() {
    await fixture.page.getByRole('combobox', { name: 'Business Unit' }).selectOption({ index: 5 });
    await fixture.page.getByRole('combobox', { name: 'Business Level' }).selectOption({ index: 1 });
    await fixture.page.getByRole('combobox', { name: 'Show Errors Only' }).selectOption({ index: 1 });
  }

  async processIdNumber() {
    const submitmsg = await fixture.page.getByText(/Process \d+ was submitted\./);
    await expect(submitmsg).toBeVisible({ timeout: 20000 })
    processnum = (await submitmsg.textContent()).split(' ')[1]
    console.log(processnum);
  }
  async processDetailsforUpdateSummData() {
    await fixture.page.getByRole('combobox', { name: 'Delinquency Method' }).selectOption({ index: 0 });
    await fixture.page.getByTitle("RP CA BU").selectOption({ index: 5 })
  }

  async searchRequestID() {

    await fixture.page.locator("//a[@title='Expand Search']").click();
    await fixture.page.locator('//input[contains(@aria-label,"Process ID")]').fill(processnum);

    await fixture.page.waitForTimeout(2000);
    await fixture.page.keyboard.press("Enter");
    await fixture.page.waitForTimeout(2000);

  }

  async reportGenerationOutput() {

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
    (await TabPromise).close()
    await popup.close()
  }


  async refreshSymbol() {
    const statusLocator = fixture.page.locator('//tr/td[@class="xen"][4]/span[@class="x2hi"]');

    let statusText;

    do {
      await fixture.page.waitForLoadState('load', { timeout: 10000 });

      statusText = await statusLocator.innerText();

      if (statusText === 'Succeeded') {
        console.log("Status is Succeeded.");
        break;
      } else {
        console.log("Status is not Succeeded. Refreshing...");

        const refreshButton = fixture.page.locator('//img[@title="Refresh"]');
        const isVisible = await refreshButton.isVisible();

        if (isVisible) {
          await refreshButton.click();
          console.log("Clicked Refresh button.");
          await fixture.page.waitForTimeout(3000);
        } else {
          console.error("Refresh button not visible.");
          break;
        }
      }

      await fixture.page.waitForTimeout(2000);

    } while (statusText !== 'Succeeded');

    await fixture.page.getByRole('cell', { name: 'Validate Customer Dunning Setup Report', exact: true }).click();
    await fixture.page.waitForTimeout(2000);

  }

  async verifyNotification(page: string, disputeId: string) {
    await expect(fixture.page.locator(`//div[contains(@title, "${page}")]`)).toBeVisible({ timeout: 60000 })
    await fixture.page.getByRole("button", { name: "Dismiss All" }).click()
    await fixture.page.waitForTimeout(3000)
    let message1 = "Credit Memo Request Approval " + disputeId + " for ODIN PROPERTIES LLC"
    let message2 = "Credit Memo Creation Post Processing Activity for Request " + disputeId
    while (!await fixture.page.getByRole("link", { name: message1, exact: true }).isVisible({ timeout: 20000 })) {
      await fixture.page.getByRole("link", { name: "Home", exact: true }).click()
      await fixture.page.getByText("Show More", { exact: true }).click()
    }
    await expect(fixture.page.getByRole("link", { name: message1, exact: true }).first()).toBeVisible({ timeout: 20000 })
    await expect(fixture.page.getByRole("link", { name: message2, exact: true }).first()).toBeVisible({ timeout: 20000 })
    await fixture.page.getByLabel("Home").click({ timeout: 60000 })
    await expect(fixture.page.getByRole("cell", { name: "Approved " + message1 }).first()).toBeVisible({ timeout: 30000 })
    await fixture.page.waitForTimeout(4000)

  }

  getYesterdaysDate(date: Date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = (date.getDate() - 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

    return `${month}/${day}/${year}`;
  }

  async getCellFromColIdx(colName: string) {
    const headers = Array.from(await fixture.page.locator('//span[@class="af_column_label-text"]').all())

    let colIndex
    for (let i = 0; i < headers.length; i++) {
      if ((await headers[i].textContent()).trim() === colName) {
        colIndex = i
        break
      }
    }
    console.log(colIndex)

    return colIndex
  }

  async queryTransactionForDispute() {
    // Class
    await fixture.page.locator('(//select)[1]').selectOption('Invoice')

    // Due Date
    await fixture.page.locator('(//select)[2]').selectOption('After')
    const dateField = fixture.page.getByRole('cell', { name: 'm/d/yy Press down arrow to access Calendar From Date Select Date', exact: true }).getByPlaceholder('m/d/yy')
    await dateField.fill(this.getYesterdaysDate(new Date()))


    // Business Unit
    await fixture.page.locator('(//select)[3]').click()
    for (let i = 0; i < 4; i++) {
      await fixture.page.keyboard.press('ArrowDown')
    }
    await fixture.page.keyboard.press('Enter')

    // Apply the filter
    await fixture.page.locator('//a[@title="Search"]').click()

    await fixture.page.waitForTimeout(3000)

    // Include current - checkbox
    if (!(await fixture.page.getByLabel('Include current').isChecked({ timeout: 20000 }))) {
      await fixture.page.getByText('Include Current').click()
    }

    await fixture.page.locator('//a[@title="Search"]').click()

    await fixture.page.waitForTimeout(3000)

    const clearAllBtn = fixture.page.locator('//a[@title="Clear All"]')
    if (!(await clearAllBtn.isVisible())) {
      await fixture.page.getByText('Query By Example').click()
    }

    await fixture.page.locator('(//span[@class="x1u p_AFStretched"])[1]').click()
    await fixture.page.keyboard.type(transactionNumber)
    await fixture.page.keyboard.press('Enter')
  }

  async fillDetailsForDispute() {
    await fixture.page.locator('(//select)[1]').selectOption('Specific Invoice Lines')
    await fixture.page.locator('(//select)[2]').click()
    for (let i = 0; i < 5; i++) {
      await fixture.page.keyboard.press('ArrowDown')
    }
    await fixture.page.keyboard.press('Enter')

    await fixture.page.getByLabel('Dispute Quantity').fill('0.5')
    await fixture.page.keyboard.press('Enter')
    await fixture.page.getByLabel('Dispute Amount').click()

    await fixture.page.waitForTimeout(2000)

    disputeAmt = await fixture.page.locator('//td[@_d_index="8"]/table/tbody/tr/td/span').textContent()
    console.log(disputeAmt)
  }

  async assertPopupWithMsg(message: string) {
    await expect(fixture.page.locator(`//div[contains(text(), '${message}')]`)).toBeVisible({ timeout: 20000 })
    await this.clickOnButton('OK')
  }

  async assertDisputedAmt() {
    const colIndex = await this.getCellFromColIdx('Disputed Amount')

    console.log(await fixture.page.locator(`(//span[@class="x2hi"])[${colIndex}]`).textContent());

    await expect(fixture.page.locator(`(//span[@class="x2hi"])[${colIndex}]`)).toContainText(disputeAmt)
  }

  async assertTransacStatusAfterDispute(status: string) {
    const colIndex = await this.getCellFromColIdx('Status')

    console.log(await fixture.page.locator(`(//span[@class="x2hi"])[${colIndex}]`).textContent());

    await expect(fixture.page.locator(`(//span[@class="x2hi"])[${colIndex}]`)).toContainText(status)
  }

  async createContact() {
    await fixture.page.locator("((//label[text()='Prefix'])[2]//following::select)[1]").selectOption({ index: 1 });
    await fixture.page.locator('(//input[@protectionkey="PersonDEO.PersonFirstName" and @aria-live="off"])[2]').fill('Test');
    await fixture.page.locator("((//label[text()='Prefix'])[2]//following::select)[2]").selectOption({ index: 1 });
    await fixture.page.locator("((//label[text()='Prefix'])[2]//following::select)[3]").selectOption({ index: 1 });
    await fixture.page.locator("((//label[text()='Prefix'])[2]//following::select)[4]").selectOption({ index: 1 });
    await fixture.page.locator("((//label[text()='Prefix'])[2]//following::select)[5]").selectOption({ index: 1 });
    await fixture.page.locator("(//input[@role='combobox'])[2]").fill('Pay Contact');
  }
  /**This method used to enter the Transaction details to fetch the Transactions List */
  async enterManageTransactionDetails(transactionSource,transactionClass,transactionType){
    await fixture.page.getByTitle('Search:  Transaction Source').click();
    await fixture.page.getByText(`${transactionSource}`, { exact: true }).click();
    //await fixture.page.getByRole('combobox', { name: 'Transaction Class' }).selectText(transactionClass);
    await fixture.page.getByRole('combobox', { name: 'Transaction Class' }).selectOption('2');
    await fixture.page.getByTitle('Search:  Transaction Type').click();
    await fixture.page.getByRole('cell', { name: `${transactionType}`, exact: true }).getByText(`${transactionType}`).click(); 
  }
   /**This method used to verify the search results */
   async verifySearchResults()
   {
     await fixture.page.locator("//table[@summary='Search Results']").waitFor({timeout:20000});
     const searchList = await fixture.page.locator("//table[@summary='Search Results']//tbody//tr").count();
     if(searchList>0)
     {
       console.log("Search Results:"+" "+searchList)
       return true;
     }
     else
     {
       console.log("Search Results:"+" "+searchList)
       return false;
     }
    }
  /**This method used to click on the options under Action link */  
  async clickOnTheSubOptionsInActionsLink(subOption,actionLink){
     await fixture.page.getByRole('link',{name:actionLink, exact:true }).click();
     await fixture.page.getByText(subOption).click();
}
/**This method used to enter the details to create a Credit Adjustment */
  async createAdjustment(activity,type,amount)
  {
    await fixture.page.getByTitle('Search: Receivables Activity').click();
    await fixture.page.getByRole('combobox', { name: 'Receivables Activity' }).fill(activity);
    await fixture.page.keyboard.press('Tab');
    await fixture.page.getByRole('combobox', { name: 'Adjustment Type' }).selectOption('4');
    await fixture.page.getByRole('textbox', {name:'Adjustment Amount'}).fill(amount);
    await fixture.page.getByRole('combobox', { name: 'Adjustment Reason' }).selectOption('11');
  }

    async addTask(){
      await fixture.page.locator("(//span[text()='Phone Call'])[1]").click({ timeout: 60000, force: true  });
      await fixture.page.getByRole("button", { name: 'OK' }).click({ timeout: 60000, force: true });
    }

    async navigateToManageCollectionStrategies(page: string){
        await fixture.page.locator("//td[text()='Collections']").click({ timeout: 20000 });
        await fixture.page.waitForTimeout(2000);
        await fixture.page.getByRole('combobox',{name: "Show"}).selectOption({value:'0'});
        await fixture.page.getByRole('textbox',{name: "Search Tasks"}).fill(page);
        await fixture.page.getByRole('img',{name: 'Search'}).click();
        await fixture.page.getByRole('link',{name: page}).click({ timeout: 20000 });

    }

    async approveAdjustment(adjustmentNum){
      await fixture.page.waitForTimeout(2000);
      await fixture.page.locator("(//input[@aria-live='off'])[1]").fill(adjustmentNum.toString());
      await fixture.page.keyboard.press('Enter');
      await fixture.page.getByRole('cell', { name: adjustmentNum, exact: true }).click({ timeout: 60000 });
      await fixture.page.waitForTimeout(3000);
      await fixture.page.getByRole("button", { name: 'Approve' }).click({ timeout: 60000 });
      await fixture.page.getByRole("textbox", { name: 'Comments' }).fill("Adjustment is Approved");
      await fixture.page.getByRole("button", { name: 'Submit' }).click({ timeout: 60000 }); 
    }






  async createCreditMemo(data: DataTable) {
    randomNumber = faker.number.int({ min: 1, max: 10000 });
    const details = data.rowsHash();
    await fixture.page.waitForTimeout(2000)
    await fixture.page.locator("//input[@aria-label='Transaction Source']").fill(details['Transaction Source'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(2000)
    await fixture.page.locator("//input[@aria-label='Transaction Type']").fill(details['Transaction Type'])
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByLabel("Bill-to Name").fill(details['Bill-to Name'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByLabel("Ship-to Site").fill(details['Ship-to Site'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole("textbox", { name: "Quantity" }).first().fill(details['Quantity'])
    await fixture.page.waitForTimeout(2000)
    await fixture.page.getByRole("textbox", { name: "Unit Price" }).first().fill(String(randomNumber))
    await fixture.page.waitForTimeout(2000);
  }

  async createCustomerReceipt(datatable:DataTable) {
    const data = datatable.rowsHash()
    receiptNumber = "TestAutomation@"+faker.number.int({ min: 1, max: 10000 })
    await fixture.page.getByRole("textbox",{name:"Business Unit",exact:true}).click()
    await fixture.page.getByText(data['Business Unit']).click({timeout:5000})
    await fixture.page.keyboard.press("Enter")
    while(!(await fixture.page.getByRole("cell",{name:`${data['Receipt Method']}`,exact:true}).isVisible())){
      await fixture.page.getByTitle("Search: Receipt Method").click()
      await fixture.page.waitForTimeout(2000)
    }
    await fixture.page.getByRole("cell",{name:`${data['Receipt Method']}`,exact:true}).first().click()
    await fixture.page.getByRole("textbox",{name:"Name",exact:true}).click()
    await fixture.page.getByRole("textbox",{name:"Name",exact:true}).fill(data['Name'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.getByRole("combobox",{name:"Site",exact:true}).fill(data['Site'])
    await fixture.page.keyboard.press("Tab")
    await fixture.page.getByRole("textbox",{name:"Entered Amount",exact:true}).fill(String(transactionAmount))
    await fixture.page.keyboard.press("Tab")
    await fixture.page.getByRole("textbox",{name:"Receipt Number",exact:true}).fill(receiptNumber)
    return [receiptNumber,transactionAmount]
  }

  async createTransactionSpecificAmount(data: DataTable) {
    await fixture.page.locator("//a[@title='Navigator']").click();
    
    await fixture.page.locator('//div[@title = "Receivables"]').click();
    await fixture.page.getByRole('link', { name: "Billing" }).click();
    await fixture.page.locator("//img[@title='Tasks']").click();
    await fixture.page.getByRole('link', { name: "Create Transaction" }).click();
    const details = data.rowsHash();
    transactionAmount = details['Amount']
    await fixture.page.locator("//input[@aria-label='Business Unit']").fill(details['Business Unit'])
    await fixture.page.locator("//input[@aria-label='Transaction Source']").fill(details['Transaction Source'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(1000)
    await fixture.page.locator("//input[@aria-label='Transaction Type']").fill(details['Transaction Type'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.waitForTimeout(1000)
    if (details['Invoicing Rule'] === "In Arrears") {
      await fixture.page.getByRole("combobox", { name: "Invoicing Rule" }).selectOption({ value: "In Arrears" })
    }
    else if (details['Invoicing Rule'] === "In Advance") {
      await fixture.page.getByRole("combobox", { name: "Invoicing Rule" }).selectOption({ value: "In Advance" })
    }
    await fixture.page.getByLabel("Bill-to Name").fill(details['Bill-to Name'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.getByLabel("Ship-to Site").fill(details['Ship-to Site'])
    await fixture.page.keyboard.press("Enter")
    await fixture.page.locator("(//input[contains(@id, 'descriptionId')])[1]").fill(details['Description'])
    await fixture.page.locator("(//input[contains(@id, 'quantity')])[1]").fill(details['Quantity'])
    await fixture.page.locator("(//input[contains(@id, 'Price')])[1]").fill(transactionAmount)
    await fixture.page.locator("//a//span[contains(text(), 'Save')]").click()
    locator = fixture.page.locator("//div[contains(@title,'Edit Transaction: Invoice')]")
    await expect(locator).toBeVisible({ timeout: 80000 })
    assert.assertTrue(locator.isVisible())
    const textContent = await locator.textContent();
    transactionNumber = textContent?.match(/Invoice\s(\d+)/)[1];
    console.log(transactionNumber);
    await fixture.page.locator('//a[@title = "Complete and Create Another"]').click()
    await fixture.page.locator('//td[contains(text() ,"Complete and Close")]').click()
    expect(await fixture.page.locator(`//div[contains(text(),'Transaction ${transactionNumber} has been completed.')]`).isVisible({ timeout: 60000 }))
    await fixture.page.getByRole("button", { name: "OK" }).click();
    return [transactionNumber, transactionAmount];
  }

 





}














