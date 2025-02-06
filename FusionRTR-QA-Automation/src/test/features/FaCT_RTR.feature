@RTRRegressionTestCases
Feature: RTR Testcases

  @TC29173
  Scenario: Validate vendor charged tax on AP invoice interfaced from Coupa
    Given I login to the fusion application using the "RP_AP_Invoice_Processor" role
    When I navigate to the "Payables" menu and select the "Invoices" page
    Then I should see "Invoices" page
    When I open the "Manage Invoices" tab
    Then I should see "Manage Invoices" page
    When I enter the invoice number "COUPA TAX _TEST2" interfaced from Coupa in the search field
    And I click on "Search" to find the invoice and select the invoice to open it
    Then I should see "Invoice Details" page
    When I expand the tax section
    Then I should validate the tax charges applied by the vendor on the invoice

  @TC32808
  Scenario: GL_VS_002_Manage Journals
    Given I login to the fusion application using the "RP_GL_Journal_Entry" role
    When I click on the "General Accounting" option in the Navigator
    And I click on "Journals" from the "General Accounting" Dropdown
    Then I should see "Journals" displayed
    When I select "Manage Journals" under Taskpane
    Then I should see "Manage Journals" page
    When I select Journal Name and click on "search"
    When I click the link for the batch to be copied
    Then I should see "Edit Journal" displayed
    When I click on Batch Actions drop down menu and select "copy batch"
    Then I should see a new Journal Batch is opened
    And I enter the Journal Batch Name in the "Create Journal" popup window
    And I click on "OK" button in the popup window
    Then I should see "Edit Journal" Page
    When I click on Cancel button
    Then I should see "Manage Journals" page

  @TC32916
  Scenario: GL_VS_009_Run Posting of Journals Automatically
    Given I login to the fusion application using the "RP_GL_Journal_Post" role
    When I click on the "General Accounting" option in the Navigator
    And I click on "Journals" from the "General Accounting" Dropdown
    Then I should see "Journals" displayed
    When I select "Run AutoPost" under Taskpane
    And I click on submit button
    Then I click on "OK" to save confirmation popup
    When I click on the "Tools" option in the Navigator
    And I click on "Scheduled Processes" from the "Tools" Dropdown
    Then I should see "Overview" displayed
    When I click on "Refresh" icon
    And I select the AutoPost Journals process line
    Then I download the .txt file under the AutoPost Journals

  @TC32040
  Scenario: AP_VS_016_Create Accounting
    Given I login to the fusion application using the "RP_AP_Period_Manager" role
    When I click on the "Payables" option in the Navigator
    And I click on "Invoices" from the "Payables" Dropdown
    Then I should see "Invoices" displayed
    When I select "Create Accounting" under Taskpane
    Then I should see "Submit Request" page
    When I Populate Process Parameters accordingly
    And I click on the "Submit" button
    Then I should see the confirmation popup
    And I click on "OK" to save
    When I click on the "Tools" option in the Navigator
    And I click on "Scheduled Processes" from the "Tools" Dropdown
    Then I should see "Overview" displayed
    When I select the Create Accounting Execution Report process line
    And I click on Republish button to download the Report

  @TC31732 @smoke
  Scenario: AP_VS_004_Manage Invoice Holds
    Given I login to the fusion application using the "RP_AP_Invoice_Processor" role
    When I click on the "Payables" option in the Navigator
    And I click on "Invoices" from the "Payables" Dropdown
    And I click on the "Manage Invoices" under Invoices from the Task Panel
    Then I should see "Manage Invoices" Page
    When I Enter Invoice Number as "BEST_101" in the "Invoice Number" input box
    And I click on "Search" button in "Manage Invoice" Page
    Then I should see the searched invoice "BEST_101"
    When I click on the "BEST_101" link
    And I click on "Edit" under the "Actions" Dropdown in "Manage Invoices" Page
    Then I should see "Edit Invoice" Page
    When I click on "Manage Holds" under the "Invoice Actions" Dropdown in "Edit Invoice" Page
    And I click on "Create" Icon in the Manage Holds popup
    And I select the reason for Hold
    And I click on "Save and Close" button in the Popup
    Then I click on "Save and Close" button in the "Edit Invoice" Page

  @TC35267 @smoke
  Scenario: AP_VS_004_Release Invoice Holds
    Given I login to the fusion application using the "RP_AP_Period_Manager" role
    When I click on the "Payables" option in the Navigator
    And I click on "Invoices" from the "Payables" Dropdown
    And I click on "Purchasing" link in the "Holds" Tile
    And I select the "BEST_101" Invoice
    And I click on "Release" from "Actions" Dropdown in Invoices Page
    Then I should see "Release Hold" Popup window
    When I select the reason for releasing the Hold
    Then I click on "OK" button in the Popup window

  @TC32807
  Scenario: 02a. GL_VS_002_Copy Journal
    Given I login to the fusion application using the "RP_GL_Journal_Entry" role
    When I click on the "General Accounting" option in the Navigator
    And I click on "Journals" from the "General Accounting" Dropdown
    And I click on the "Manage Journals" from the Task Panel
    Then I should see "Manage Journals" Page
    When I Enter "test" in the Journal Search Box
    And I set Accounting Period to "Dec-24"
    And I click on "Search" button in the Manage Journals Page
    And I select click on the Journal Link
    Then I should see "Edit Journal" Page
    When I click on "Copy" option from "Batch Actions" Dropdown in Edit Journals Page
    And I enter the Journal Batch Name in the "Create Journal" popup window
    And I click on "OK" button in the popup window
    Then I should see "Edit Journal" Page
    When I click on "Request Approval" option from "Batch Actions" Dropdown in Edit Journals Page
    And I should see a message "Your journal approval request has been submitted." in the popup window
    Then I click on "OK" Button in the popup window

  @TC32716
  Scenario: 13. CM_VS_013_Run Standard Reports_Cash to General Ledger Reconciliation Report
    Given I login to the fusion application using the "RP_CM_Bank_Statement_and_Reconciliation" role
    When I click on the "Cash Management" option in the Navigator
    And I click on "Bank Statements and Reconciliation" from the "Cash Management" Dropdown
    And I click on the "Cash to General Ledger Reconciliation Report" from the Task Panel
    And I fill the following details for Cash to General Ledger Reconciliation Report:
      | Bank Account           | BofA Domestic Operating 00776 |
      | From Accounting Period | Jan-24                        |
      | To Accounting Period   | Dec-24                        |
    And I click on the "Submit" button
    Then I should see the process confirmation message in a popup window
    When I click on "OK" button in the popup window
    And I click on the "Tools" option in the Navigator
    And I click on "Scheduled Processes" from the "Tools" Dropdown
    And I search for the process Using Process ID
    And I wait till the process is succeeded
    And I click on the "Cash to General Ledger Reconciliation Report" line to view process details
    Then I click on Republish button to download the Report

  @TC32716
  Scenario: 13. CM_VS_013_Run Standard Reports_Bank Statement Report
    Given I login to the fusion application using the "RP_CM_Bank_Statement_and_Reconciliation" role
    When I click on the "Cash Management" option in the Navigator
    And I click on "Bank Statements and Reconciliation" from the "Cash Management" Dropdown
    And I click on the "Bank Statement Report" from the Task Panel
    And I fill the following details for Bank Statement Report:
      | Bank Account            | BofA Domestic Operating 00776 |
      | From Statement End Date | 1/1/24                        |
      And I click on the "Submit" button
      Then I should see the process confirmation message in a popup window
      When I click on "OK" button in the popup window
      And I click on the "Tools" option in the Navigator
      And I click on "Scheduled Processes" from the "Tools" Dropdown
      And I search for the process Using Process ID
      And I wait till the process is succeeded
      And I click on the "Bank Statement Report" line to view process details
      Then I click on Republish button to download the Report
  
  @TC31730
  Scenario: AP_VS_003_Create Invoice
    Given I login to the fusion application using the "RP_AP_Invoice_Processor" role
    When I click on the "Payables" option in the Navigator
    And I click on "Invoices" from the "Payables" Dropdown
    Then I should see the Invoices Dashboard window opens
    When I click on the "Tasks"
    And I click on the "Create Invoice" from the Invoices panel
    Then I should see the Create Invoice window opens
    When I select Business Unit as "<businessUnit>" and Supplier as "<supplier>" and fill the Invoice Number in the Invoice Header section
    And I enter the line item details
    And I enter the below Distribution Combination ID details
   |ENTITY      |RealPage, Inc.      |
   |ACCOUNT     |Operating Acct - A/P|
   |PRODUCT     |Default Product     |
   |COST CENTER |Default Cost Center |
   |PROJECT     |Default Project     |
   And I click on "Validate" from the "Invoice Actions" link
   Then I see Invoice Summary should appear with the Validation details
   #When I click on Initiate Approval
   #Then I should see the Approval status as "Initiated"
   When I click on Save and Close button
   Then I should see the Invoice page with Invoices list
   When I search for created invoice
   Then I see the created invoice in the search results

  Examples:
      | businessUnit| supplier           |
      | RP US BU    | Test BEST Supplier | 

  @TC32034
  Scenario: Create an Asset Invoice
    Given I login to the fusion application using the "RP_AP_Invoice_Processor" role
    When I click on the "Payables" option in the Navigator
    And I click on "Invoices" from the "Payables" Dropdown
    Then I should see "Invoices" Page.
    When I click on the "Create Invoice" from the Task Panel
    Then I should see "Create Invoice" Page
    And I create an Asset Invoice with the following details:
      | Business Unit            | RP US BU                                  |
      | Supplier                 | Test BEST Supplier                        |
      | Distribution Combination | 101-151399-00000-000000-000-0000-00000000 |
    And I validate the Asset Invoice
    Then I should see "Invoice Summary" details
    And I click on the "Save and Close" button
    Then I should see "Invoices" Page.
    When I search for the created invoice
    Then I should see the created invoice

  @TC32730 
  Scenario: Inquire Assets
    Given I login to the fusion application using the "RP_FA_Accountant" role
    When I click on the "Fixed Assets" option in the Navigator
    And I click on "Assets" from the "Fixed Assets" Dropdown.
    And I click on the "Inquire Assets" from the Task Panel
    Then I should see "Asset Inquiry" Page
    When I search for "012646" Asset
    Then I should see "Asset 012646" Page
    When I click on "Transactions" tab
    Then I should see Transaction details
    When I click on "Cost History" tab
    Then I should see Cost History details
    When I click on "Depreciation" tab
    Then I should see Depreciation History
  
@TC32743
Scenario: FA_VS_007_Update Descriptive Details
    Given I login to the fusion application using the "RP_FA_Accountant" role
    When I click on the "Fixed Assets" option in the Navigator
    And I click on "Assets" from the "Fixed Assets" Dropdown
    And I select "Update Descriptive Details" under Taskpane
    Then I should see the Update Descriptive Details page with "Search: Assets"
    When I select Asset Book as "<Book>" and enter Category as "IT Equip-Computer" and click on search
    Then I should see the Asset details
    When I select the Asset and click on "Change Descriptive Details" button
    Then I should see the "Change Descriptive Details" page with Descriptive Details
    When I change the Property Type and Property Class
    Then I Click on Cancel button
    And I click on No Button in the Warning popup window
    
    Examples:
      | Book        | 
      | RP_US_CORP  |


@TC32932
  Scenario: GL_VS_022_Allocations Infolet
    Given I login to the fusion application using the "RP_GL_Journal_Entry" role
    When I click on the "General Accounting" option in the Navigator
    And I click on "General Accounting Dashboard" from the "General Accounting" Dropdown
    Then I should see "General Accounting Dashboard" displayed
    When I click on "View" dropdown and select Create
    Then I should see "Create Account Group" displayed
    When I fill "Name" of account Group
    And I add a new row in PMC section of account group
    And I click on save dropdown
    Then I should see "General Accounting Dashboard" displayed

  @TC32738
  Scenario: FA_VS_006_Adjust Asset (Single Asset)
    Given I login to the fusion application using the "RP_FA_Accountant" role
    When I click on the "Fixed Assets" option in the Navigator
    And I click on "Assets" from the "Fixed Assets" Dropdown
    Then I should see "Assets" Page
    When I create an asset
    And I click on the "Adjust Assets" from the Task Panel
    Then I should see "Adjust Assets" Page
    When I search for the asset to be modified
    Then search result will be displayed
    When I select the asset and click on "Change Financial Details" button
    Then I should see "Change Financial Details:" Page
    When I make Adjustment for Cost
    And I click on the "Submit" button
    Then I should see "Adjust Assets" Page
    When I click on the "Fixed Assets" option in the Navigator
    And I click on "Assets" from the "Fixed Assets" Dropdown
    And I click on the "Inquire Assets" from the Task Panel
    Then I should see "Asset Inquiry" Page
    When I search for the asset on which adjustment has been made
    Then I should see that asset will be reflected with changes performed
    When I click on transaction tab and search with asset number
    Then I should see adjustment details










   
