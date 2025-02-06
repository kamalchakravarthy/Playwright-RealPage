@OTCRegressionTestCases
Feature: OTC Testcases
  
  @TC33016
  Scenario: AR_VS_011_Copy Invoice Transaction
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Manage Transactions" from the Task Panel
    Then I should see "Manage Transactions" Page
    When I enter the "94014" in the "Transaction Number" input box
    And I click on Search button
    Then I should see Transaction "94014" displayed
    When I click on "Duplicate" from the "Actions" Dropdown
    Then I should see "Create Transaction" Page
    When I change the "Unit Price" Value for Duplicate Transaction
    And I click on "Save" button
    Then I should see "Edit Transaction" Page
    When I click on "Complete and Close" from the "Complete and Review" Dropdown in Edit Transaction Page
    Then I should see a popup with message Transaction has been completed
    When I click on "OK" Button in the popup
    When I click on the "Billing" option in the Navigator
    And I click on the "Manage Transactions" from the Task Panel
    And I enter the "transactionNumber" in the Transaction Number input box
    And I click on Search button
    Then I should see the searched transaction

  @TC33743
  Scenario: AVC_VS_001_Manage Customer
    Given I login to the Fusion application with "RP_AR_Collections_Manager" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    Then I should see "Billing" Page
    And I click on the "Manage Customers" from the Task Panel
    Then I should see "Manage Customers" Page
    And I search for "organization name" and click on search
    When I select the "JMG REALTY LLC" in search page
    Then I should see "Edit Account" Page
    When I click on "profile history" tab in account profile
    Then I should see "Profile History" section
    When I click on Actions dropdown in profile history and select "Correct Record"
    Then I should see Account profile section
    And I review "collector" in Credit and Collections
    And I review "Preferred Contact Method" in Credit and Collections
    Then I ensure "Send dunning letters" is selected in Credit and Collections

  @TC33744
  Scenario: AVC_VS_002_Run Refresh Receivables Transactions for Customer Account Summaries
    Given I login to the Fusion application with "RP_AR_Collections_Manager" Persona
    When I click on the "Tools" option in the Navigator
    And I click on "Scheduled Processes" from the "Tools" Dropdown in the Navigator
    Then I should see "Overview" Page
    When I click on "Schedule New Process" in overview page
    Then I should see "Schedule New Process" Page
    When I search for "Refresh Receivables Transactions for Customer Account Summaries" in process details page
    And I click on "OK" button in receivables
    And I click on the Submit button in process details page
    Then I should see "Process Details" Page
    Then I click on "OK" button in confirmation popup

  @TC33771
  Scenario: AVC_VS_003_Run Collections Deliquency Management
    Given I login to the Fusion application with "RP_AR_Collections_Manager" Persona
    When I click on the "Tools" option in the Navigator
    And I click on "Scheduled Processes" from the "Tools" Dropdown in the Navigator
    Then I should see "Overview" Page
    When I click on "Schedule New Process" in overview page
    Then I should see "Schedule New Process" Page
    When I search for the "Collections Delinquency Management" in process details page
    And I click on "OK" button in receivables
    And I select the business unit as "RP US BU" and mode as "Quick"
    And I click on the Submit button in process details page
    Then I should see "Process Details" Page
    When I click on "OK" button in confirmation popup
    Then I should see the popup saying "/^Process \d+ was submitted\.$/"
    And I click on "OK" button in confirmation popup

  @TC33772
  Scenario: AVC_VS_003_Run Collections Scoring and Strategy Assignment
    Given I login to the Fusion application with "RP_AR_Collections_Manager" Persona
    When I click on the "Tools" option in the Navigator
    And I click on "Scheduled Processes" from the "Tools" Dropdown in the Navigator
    Then I should see "Overview" Page
    When I click on "Schedule New Process" in overview page
    Then I should see "Schedule New Process" Page
    When I search "Collections Scoring and Strategy Assignment" in process details page
    And I click on "OK" button in the schedule process selection popup
    Then I should see the "Process Details" page
    When I enter below fields and click on Submit
      | Business Unit                                | RP US BU       |
      | Allow Strategy to Change                     | Yes            |
      | Assign Strategy from Customer Name           | Jmg Realty, Inc |
      | To Customer Name                             | Jmg Realty, Inc |
      | Assign Strategy from Customer Account Number | A1105000596    |
      | To Customer Account Number                   | A1105000596    |
      | Assign Strategy from Bill-to Site Location   |     1020241121 |
      | To Bill-to Site Location                     |     1020241121 |
    Then I should see the schedule process submitted with process ID
    And I click on "OK" button in confirmation popup

  @TC33019
  Scenario: AR_VS_007_Adjustment to the Receivable invoice transaction
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Manage Transactions" from the Task Panel
    Then I should see "Manage Transactions" Page
    When I search with Transaction Number and complete as Yes
    And I click on the first record link with Transaction Number
    And I click on Manage Adjustments option in the Actions menu
    And I enter Receivables Activity as "US Late charges" and Adjustment Type as "Charges Adjustments" and Adjustment Amount as "121"
    And I click on the "Submit" button in the create adjustment window
    Then I should see the message saying "/^The adjustment \d+ has been created\.$/"

  @TC33037
  Scenario: AR_VS_016_Manually Create a Miscellaneous Debit Memo
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Create Transaction" from the Task Panel
    Then I should see "Create Transaction: Invoice" Page
    When I create a debit memo transaction with the following details:
      | Transaction Class  | Debit Memo       |
      | Business Unit      | RP US BU         |
      | Transaction Source | Manual           |
      | Transaction Type   | Debit Memo       |
      | Invoicing Rule     |                  |
      | Bill-to Name       | Jmg Realty, Inc. |
      | Ship-to Site       |       4000032965 |
      | Description        | Test             |
      | Quantity           |                1 |
    And I save and close the transaction
    Then the transaction should be created successfully

  @ado_33746
  Scenario: AVC_VS_002_Assign a Customer Contact for Dunning
    Given I login to the Fusion application with "RP_AR_Collections_Agent" Persona
    When I click on the "Others" option in the Navigator
    And I click on "Collections" from the "Others" Dropdown in the Navigator
    And I choose "Customer by Name" option from the search filter
    And I search for the customer "Jmg Realty, Inc."
    Then I should see "Jmg Realty, Inc." section
    When I click on the "Profile" tab
    And I select the business level field as "Customer"
    And I click on the "Contact" tab
    And I click on the plus sign in the contact tab
    And I enter the following contact details:
      | First Name     | Jmg       |
      | Last Name      | RealtyInc |
      | Job Title Code | Billings  |
    And I click on the plus sign in the contact responsibilities sub-region
    And I select "Dunning" from the Responsibility LOV
    And I select "Set Primary Responsibility" from the Actions dropdown
    And I click on the "OK" button
    Then the customer contact details should be updated successfully
    When I click on the plus sign to add the email "abc@xyz.com"
    And I click on the "Save" button
    Then the customer mail details should be updated successfully

  @TC33032
  Scenario: AR_VS_013_Unapply Credit Memo
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I create a transaction with the following details:
      | Business Unit      | RP US BU         |
      | Transaction Source | Manual           |
      | Transaction Type   | Invoice          |
      | Bill-to Name       | Jmg Realty, Inc. |
      | Ship-to Site       |       4000032965 |
      | Description        | Test             |
      | Quantity           |                1 |
    When I click on the tasks menu
    And I click on "Credit Transaction" in the tasks menu
    Then the "Credit Transaction" page should be displayed
    When I credit the created transaction
    And I login to the Fusion application with "RP_AR_Receipt_Processor" Persona
    And I navigate to the "Accounts Receivable" page under the "Receivables" section in the Navigator
    Then the "Accounts Receivable" page should be displayed
    When I click on the tasks menu
    And I click on "Manage Credit Memo Applications" in the tasks menu
    Then the "Manage Credit Memo Applications" page should be displayed
    When I enter the transaction number in the input box
    And I click on Search button
    Then I should see the searched transaction
    When I click on the transaction number link
    And I unapply the application
    Then the row containing the credit memo application details should be removed
    When I account the unapplication of the credit memo
    Then the accounting should be completed successfully
    When I click on the "View Accounting" button in the credit memo actions menu
    Then the accounting lines window should be displayed

  @TC29208 
  Scenario: Validate tax calculation on converted invoice
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    Then I should see "Billing" Page
    When I click on the "Manage Transaction" from the Task Panel
    Then I should see "Manage Transactions" Page
    When I select the transaction source as "<TransactionSource>" in the Transaction source input box
    And I click on Search button
    Then I should see the searched transaction with transaction source as "<TransactionSource>"
    When I click on the transaction number from the search results
    Then I should see the Review Transaction page with invoice details
    When I click on the Tax amount
    Then I should not see the Tax lines in the Detail Tax Lines popup

    Examples:
      | TransactionSource |
      | RP Conversion     |

  @TC33030
  Scenario: AR_VS_013_Credit the Receivable Invoice Transaction
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I create a transaction with the following details:
      | Business Unit      | RP US BU         |
      | Transaction Source | Manual           |
      | Transaction Type   | Invoice          |
      | Bill-to Name       | Jmg Realty, Inc. |
      | Ship-to Site       |       1000005872 |
      | Description        | Test             |
      | Quantity           |                1 |
    And I click on "Home" Icon in the Top-Left Corner
    And I click on "Navigator" Icon
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Manage Transactions" from the Task Panel
    Then I should see "Manage Transactions" Page
    When I enter the "transactionNumber" in the Transaction Number input box
    And I click on Search button
    Then I should see the searched transaction
    When I click on the Transaction Number link in the "Manage Transactions" Page
    And I click on "Credit Transaction" from the "Actions" Dropdown in "Review Transaction" Page
    Then I should see "Credit Transaction" Page
    When I select Credit Reason from the "Credit Reason" Dropdown
    And I enter "Credit Percentage" under "Transaction Amounts" section
    And I click on "Credit Lines" Button under "Transaction Amounts" Section
    Then I should see "Credit Lines" Page
    When I click on "Save and Close" Button
    And I click on "Edit Distributions" Button under "Transaction Amounts" Section
    Then I click on "Save and Close" in the Edit Distributions window
    When I click on "Save" Button
    And I click on "Complete and Review" from "Complete and Close" DropDown
    Then I should see Status as "Complete" for the Transaction

  @TC33065
  Scenario: AR_VS_027_SubLedger Accounting Journal Inquiry
    Given I login to the Fusion application with "RP_AR_Period_Manager" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    Then I should see "Billing" Page
    When I click on the "Review Journal Entries" under Accounting from the Task Panel
    Then I should see the "Review Journal Entries" page opens with below two tabs
      | Journal Entries     |
      | Journal Entry Lines |
    When I enter ledger as "<Ledger>" and journal source as "<JournalSource>" and date in the search fields of Journal entries section
    And I click on Search button
    Then I should see the search results
    When I select any transaction from the search results
    Then I should see the "Journal Summary" and "Transaction Summary" tabs will appear in the bottom part of the screen
    When I click on "Journal Summary" tab
    Then I should see the journal details as "<Ledger>" and Entry Description and Accounting Date and Journal Category under journal summary tab
    When I click on "Transaction Summary" tab
    Then I should see the Transaction details as customer name and customer number and business unit as "<BusinessUnit>" and invoice number and transaction type under Transaction Summary tab
    When I click on Done button
    Then I should see Review Journal Entries page closes and "Billing" page should display

    Examples:
      | Ledger       | JournalSource | BusinessUnit |
      | RP US USD PL | Receivables   | RP US BU     |

  @TC33041  
  Scenario: Enter a Miscellaneous Receipt
    Given I login to the Fusion application with "RP_AR_Receipt_Processor" Persona
    When I navigate to the "Accounts Receivable" page under the "Receivables" section in the Navigator
    And I click on the tasks menu
    And I click on "Create Receipt" in the tasks menu
    Then the "Create Receipt" page should be displayed
    When I create a Receipt with the below details
      | Business Unit        | RP US BU        |
      | Receipt Type         | Miscellaneous   |
      | Receipt Method       | RP Check        |
      | Receivables Activity | RP MISC Receipt |
      | Entered Amount       |           10000 |
    And I click on Save and Close
    Then I click on the "OK" button

  @TC33012 
  Scenario: Change Profile Class
    Given I login to the Fusion application with "RP_AR_Collections_Manager" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Manage Customers" from the Task Panel
    Then the "Manage Customers" page should be displayed
    When I search for "organization name" and click on search
    And I select the "JMG REALTY LLC" in search page
    Then I should see "Edit Account" Page
    When I click on "profile history" tab in account profile
    Then I should see "Profile History" section
    When I click on Actions dropdown in profile history and select "Correct Record"
    And I select new profile class as "TEST_Enterprise" or "TEST_SMB"
    Then I click Yes in the warning pop updated
    And I click on Save and Close

  @TC33046
  Scenario: AR_VS_023_Write-off Receivable Transaction
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I create a transaction with the following details:
      | Business Unit      | RP US BU            |
      | Transaction Source | Manual              |
      | Transaction Type   | Invoice             |
      | Bill-to Name       | ODIN PROPERTIES LLC |
      | Ship-to Site       |          4000111539 |
      | Description        | Test                |
      | Quantity           |                   1 |
    And I click on "Home" Icon in the Top-Left Corner
    And I click on "Navigator" Icon
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Manage Transactions" from the Task Panel
    Then I should see "Manage Transactions" Page
    When I enter the "transactionNumber" in the Transaction Number input box
    And I click on Search button
    Then I should see the searched transaction
    When I click on the Transaction Number link in the "Manage Transactions" Page
    And I click on "Manage Adjustments" from the "Actions" Dropdown in "Review Transaction" Page
    Then I should see "Manage Adjustments" Page
    When I click on "Create" Icon in the "Manage Adjustments" Page
    And I fill the Create Adjustments popup with the following details:
      | Receivables Activity | US Bad Debts Write-off |
      | Adjustment Type      | Invoice Adjustments    |
    And I click on "Submit" Button in "Create Adjustment" Popup window
    And I should see a popup with message "The Adjustment has been created"
    Then I click on "OK" Button in the Popup Window

  @TC_33038
  Scenario: AR_VS_017_Customer Account Inquiry
    Given I login to the Fusion application with "RP_AR_Inquiry" Persona
    When I click on the "Tools" option in the Navigator
    And I click on "Scheduled Processes" from the "Tools" Dropdown in the Navigator
    Then I should see "Overview" Page
    When I click on "Schedule New Process" in overview page
    Then I should see "Schedule New Process" Page
    When I search for "Refresh Receivables Transactions for Customer Account Summaries" in process details page
    And I click on "OK" button in receivables
    And I click on the Submit button in process details page
    Then I should see "Process Details" Page
    And I click on "OK" button in confirmation popup
    When I click on "Refresh" icon in Process Details Page
    Then the process status should update to Succeeded
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    Then I should see "Billing" Page
    And I click on the "Review Customer Account Details" under Review Customer Account Details from the Task Panel
    Then I should see "Review Customer Account Details" Page
    When I enter "JMG REALTY LLC" as Customer
    And I click on "Search" in the Review Customer Account Details
    Then I should be able to view the following Account details
      | Total Open Receivables  |
      | Total Transaction Due   |
      | Pending Application     |
      | Total Past Due          |
      | Transactions in Dispute |

  @TC33808 @smoke
  Scenario: Process Adjustments
    Given I login to the Fusion application with "RP_AR_Collections_Agent" Persona
    When I click on the "Others" option in the Navigator
    And I click on "Collections" from the "Others" Dropdown in the Navigator
    Then I should see "Collections" Page
    When I search for customer named "<CustomerName>"
    Then I should see "<CustomerName>" Page
    When I select "<TransactionNumber>" transcation and click on "Adjust"
    Then I should see "Manage Adjustments" Page
    When I create a new Adjustment with the following details:
      | Receivables Activity | US Bank Fees     |
      | Adjustment Type      | Line Adjustments |
      | Adjustment Amount    |               -1 |
      | Adjustment Reason    | Charges          |
    And I click on "OK" in the adjustment info popup
    Then I should see "Manage Adjustments" Page

    Examples:
      | CustomerName     | TransactionNumber |
      | Jmg Realty, Inc. |            105023 |

  @TC33745
  Scenario: AVC_VS_002_Run Dunning related Programs
    Given I login to the Fusion application with "RP_AR_Collections_Manager" Persona
    When I click on the "Tools" option in the Navigator
    And I click on "Scheduled Processes" from the "Tools" Dropdown in the Navigator
    Then I should see "Overview" Page
    When I click on "Schedule New Process" in overview page
    And I search  for "Update Collections Summary Data " in process details page
    And I click on "OK" button in the schedule process selection popup
    Then I should see "Process Details" Page
    When I select the details
    And I click on the Submit button in process details page
    And I click on "OK" button in confirmation popup
    And I click on "Schedule New Process" in overview page
    And I search  for "Validate Customer Dunning Setup Report" in process details page
    And I click on "OK" button in the schedule process selection popup
    Then I should see "Process Details" Page
    When I select the details in that page
    And I click on the Submit button in process details page
    And I capture the Process ID number
    And I click on "OK" button in confirmation popup
    And I click on "Refresh" symbol
    And I click on "Schedule New Process" in overview page
    And I search  for "Send Dunning Letters" in process details page
    And I click on "OK" button in the schedule process selection popup
    Then I should see "Process Details" Page
    When I enter the deatils in that page
    And I click on the Submit button in process details page
    And I click on "OK" button in confirmation popup
    And I click on "Refresh" symbol
    And I click on the "RequestID"
    And I click on Refresh
    Then I see the generated output

  @TC33034
  Scenario: AR_VS_014_Dispute Transactions
    Given I login to the Fusion application with "RP_AR_Collections_Agent" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Manage Transactions" from the Task Panel
    Then I should see "Manage Transactions" Page
    When I enter the "93003" in the "Transaction Number" input box
    And I click on Search button
    Then I should see Transaction "93003" displayed
    When I click on the Transaction Number "93003" link in the Manage Transactions Page
    Then I should see "Review Transaction" Page
    When I click on "Submit a Dispute" from the "Actions" Dropdown in "Review Transaction" Page
    Then I should see "Manage Disputes" Page
    When I enter "1" as Dispute Amount in dispute details section
    And I select "Billing" as the Dispute Reason
    And I click on "Submit" Button
    And I click on "OK" Button in the "Dispute request" popup
    And I click on "Save" Button
    And I click on "Home" Icon
    And I click on "Show More" link under the "Things to Finish" Section
    Then I should see dispute transaction state as submitted in the "Notifications" Page

  @TC33749 
  Scenario: AVC_VS_005_Process Disputes and Promises
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I create a transaction with the following details:
      | Business Unit      | RP US BU         |
      | Transaction Source | Manual           |
      | Transaction Type   | Invoice          |
      | Bill-to Name       | Jmg Realty, Inc. |
      | Ship-to Site       |       4000032965 |
      | Description        | Test             |
      | Quantity           |                1 |
    And I login to the Fusion application with "RP_AR_Bill_Dispute_Manager" Persona
    And I navigate to the "Collections" page under the "Others" section in the Navigator
    Then the "Collections" page should be displayed
    When I choose "Customer by Name" option from the search filter
    And I search for the customer "Jmg Realty, Inc."
    Then I should see "Jmg Realty, Inc." section
    When I click on the "Transactions" link
    And I query the transaction using the filters
    Then the transaction should be retrieved successfully
    When I click on the "Dispute" button
    Then I should see "Manage Disputes" section
    When I fill in the details for the dispute
    And I click on the "Submit" button
    Then a popup should be displayed confirming the action with the message containing the text "Dispute request"
    When I query the transaction using the filters
    Then the disputed amount should be reflected in the view
    When I click on the "Promise" button
    And I click on the "Submit" button
    Then a popup should be displayed confirming the action with the message containing the text "The promise or promises have been saved"
    When I query the transaction using the filters
    Then the transaction status should be set to "Current"
    And I click on the "Save" button
    Then a popup should be displayed confirming the action with the message containing the text "Your changes were saved"

  @TC33009 @smoke
  Scenario: AR_VS_001_Add Contact
    Given I login to the Fusion application with "RP_AR_Collections_Manager" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Manage Customers" from the Task Panel
    Then I see Manage Customers page
    When I enter Organization Name
    And I click on Search Button
    And I select the "<Organization Name>" cell from the Search
    And I click on the "<Account Number>" link which is highlighted under Accounts region
    Then I see Edit Account page
    When I click on Communication Tab
    And I click on Edit Contacts button under Communication Tab
    And I click on Create Contact icon
    Then I see Create Contact
    When I enter the required details
    And I click on OK button
    Then I see the new contact created
    When I select the new contact created
    Then I see Contact Points
    When I click on the Create icon under Contact Points
    And I enter the mandatory fields
    And I click on OK
    And I click on Save and Close
    Then I see Edit Account page

    Examples:
      | Organization Name | Account Number |
      | Jmg Realty, Inc.  | A1105000596    |

  @TC34791 @smoke
  Scenario: AR_VS_004_Create Manual Transaction (Credit Memo)
    Given I login to the Fusion application with "RP_AR_Credit_Memo_Processor" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Create Transaction" from the Task Panel
    Then I should see "Create Transaction: Credit Memo" Page
    When I create a Credit memo transaction with the following details:
      | Business Unit      | RP US BU                |
      | Transaction Source | Manual                  |
      | Transaction Type   |  Credit Memo            |
      | Bill-to Name       | Jmg Realty, Inc.        |
      | Ship-to Site       |              1000005872 |
      | Quantity           |                       1 |
    And I fill the Memo lines under Credit Memo Details  
    And I click on Tax Determination
    And I populate Tax Classification
    And I click on Save Button
    And I click on the pencil icon
    Then I see the Detail Tax Lines pop-up
    When I click on the Actions button
    And I click on Add row
    And I select the Rate Name
    And I click on Save and Close button
    Then I see updated Tax
    And I see the status as incomplete
    When I click on Actions button
    And I click on Edit Distributions
    Then I see Edit Distributions pop-up
    When I select Distribution
    And I click on OK
    And I click on Save and Close button
    Then I see Edit Transaction page
    When I save and close the transaction in Edit Transaction Page
    Then the transaction should be created successfully

  @TC34827 @smoke
  Scenario: AR_VS_007_Adjustment Approval (Credit Memo)
    Given I login to the Fusion application with "RP_AR_Credit_Memo_Processor" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator  
    Then I should see "Billing" Page
    When I click on the "Manage Transactions" from the Task Panel
    Then I should see "Manage Transactions" Page
    When I select Transaction Source as "Manual" and Transaction Class as "Credit Memo" and Transaction Type as "Credit Memo"
    And I click on Search button
    Then I should see the search results display with the search criterion
    When I click on the Transaction Number link from the search results
    Then I see the "Review Transaction: Credit Memo" page opens
    When I click on the "Manage Adjustments" option under the "Actions" link button
    Then I see the "Manage Adjustments: Credit Memo" page opens
    When I click on "Create" Icon in the "Manage Adjustments" Page
    Then I see the "Create Adjustment" window
    When I select Receivables Activity as "<ReceivablesActivity>" and Adjustment Type as "<AdjustmentType>" and Adjustment Amount as "<AdjustmentAmount>"
    And I click on "Submit" Button in "Create Adjustment" Popup window
    Then I should see a popup with message "The Adjustment has been created"
    When I click on "OK" Button
    Then I see the Created Adjustment in the Manage Adjustment Page
    When I login to the Fusion application with "RP_AR_Invoice_Manager" Persona
    And I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator  
    Then I should see "Billing" Page
    When I click on the Approval Infotile to view Adjustment on the left portion of the screen
    And I select the adjustment under review then click on "Approve" button
    Then I see the Approve Adjustment popup window
    When I enter comment in the Approve Adjustment popup
    And I click on "Submit"
    Then I see the confirmation message as Approved

Examples:
      | ReceivablesActivity       | AdjustmentType  |AdjustmentAmount|
      | Write-off to Credit Agency| Line Adjustments|-2              |    

  @TC33768 @smoke
  Scenario: AVC_VS_003_Create Strategies and Assign Strategies
    Given I login to the Fusion application with "RP_AR_Setup_and_Maintenance" Persona
    When I open "Setup and Maintenance" in "Settings and Actions"
    Then I should see "Setup: Financials" Page
    When I navigate to "Manage Collections Strategies"
    Then I should see "Manage Collections Strategies" Page
    When I click on the "Create" icon
    Then I should see "Create Strategy Group" Page
    When I enter "Group Name" as "Account test"
    And I provide following details under Strategies:
      | Method Name             | Account test |
      | Lowest Applicable Score |                  10 |
    Then I should see new window with all available tasks
    When I select and add task
    And I enter the "Order" as "100"
    And I click on "Save and Close"
    Then I should able to see created strategy

    @TC34921 @smoke
    Scenario: AVC_VS_004_Adjustment Approval Limits
    Given I login to the Fusion application with "RP_AR_Invoice_Manager" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator  
    Then I should see "Billing" Page
    When I click on the "Approve Adjustments" from the Task Panel
    Then I should see "Approve Adjustments" Page
    When I search and approve adjustment
    Then I should see the popup with message "/^Adjustment \d+ has been approved.\.$/"
    When I click on "OK" button in confirmation popup and signout
    And I login to the Fusion application with "RP_AR_Collections_Agent" Persona
    And I click on the "Others" option in the Navigator
    And I click on "Collections" from the "Others" Dropdown in the Navigator  
    Then I should see "Collections" Page
    When I search for customer named "<CustomerName>"
    Then I should see "<CustomerName>" Page
    When I select "<TransactionNumber>" transcation and click on "Adjust"
    Then I should see "Manage Adjustments" Page
    And I should see Adjustment Status as Approved.



        Examples:
      | CustomerName     | TransactionNumber |
      | Jmg Realty, Inc. |            105023 |

@TC33007 @smoke
Scenario:AR_VS_004_Update Completed Transaction (Invoice)
   Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I create a transaction with the following details:
      | Business Unit      | RP US BU            |
      | Transaction Source | Manual              |
      | Transaction Type   | Invoice             |
      | Bill-to Name       | ODIN PROPERTIES LLC |
      | Ship-to Site       |          4000111539 |
      | Description        | Test                |
      | Quantity           |                   1 |
    And I click on "Home" Icon in the Top-Left Corner
    And I click on "Navigator" icon
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    And I click on the "Manage Transactions" from the Task Panel
    Then I should see "Manage Transactions" Page
    When I enter the "transactionNumber" in the Transaction Number input box
    And I click on Search button
    Then I should see the searched transaction
    When I click on the Transaction Number link in the "Manage Transactions" Page
    Then I should see "Review Transaction" Page
    When I click on "Incomplete" button
    And I click on the "Save" button
    And I click on "Complete and Close" from "Complete and Create Another" DropDown
    Then I should see Status as "Complete" for the Transaction

@TC33040 @smoke
  Scenario: AR_VS_019_Create Customer Receipt - Unapplied, Applied, On Account and Reversed
    Given I login to the Fusion application with "RP_AR_Inquiry" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Billing" from the "Receivables" Dropdown in the Navigator
    Then I should see "Billing" Page
    When I click on the "Review Customer Account Details" under Review Customer Account Details from the Task Panel
    Then I should see "Review Customer Account Details" Page
    When I enter "CROWN BAY GROUP LLC" as Customer
    And I click on "Search" in the Review Customer Account Details
    Then I should be able to view the following Account details
      | Total Open Receivables  |
      | Total Transaction Due   |
      | Pending Application     |
      | Total Past Due          |
      | Transactions in Dispute |

  @TC33040 @smoke
  Scenario: AR_VS_019_Create Customer Receipt - Unapplied, Applied 
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I create a transaction with the following details with certain Amount:
      | Business Unit      | RP US BU            |
      | Transaction Source | Manual              |
      | Transaction Type   | Invoice             |
      | Bill-to Name       | CROWN BAY GROUP LLC |
      | Ship-to Site       | 1000022579          |
      | Description        | Test                |
      | Quantity           | 1                   |
      |Amount              | 3,000.00            |
  
    And I logout from the Fusion Application
    And I login to the Fusion application with "RP_AR_Receipt_Processor" Persona
    And I navigate to the "Accounts Receivable" page under the "Receivables" section in the Navigator
    And I click on the "Create Receipt" from the Task Panel
    Then I should see "Create Receipt" Page
    When I create a Receipt with the following details:
    | Business Unit	 | RP US BU            |
    | Receipt Method | <receiptmethod>     |
    | Name           | CROWN BAY GROUP LLC |
    | Site           | 1100029358          |
    And I click in Add Icon to attach documents at the receipt header level
    And I click on "Submit" from "Submit and Create Another" dropdown
    Then I should see a popup with message Receipt has been created sucessfully
    When I click on "Accounts Receivable" in the Navigator
    And I click on the "Manage Receipts" from the Task Panel
    Then I should see "Manage Receipts" Page
    When I enter receipt number in the "Receipt Number" input box
    And I click on "Search" Button
    Then I should see the searched receipt
    When I click on Receipt Number link 
    Then I should see whole receipt amount displayed under Unapplied Amount
    When I click on "Application" Tab under the Receipt Details Section
    And I click on "Add Open Receivables" Button
    And I enter transaction number in the "Receipt Reference Number" Input box
    And I click on "Search" Button
    And I click on the transaction number row 
    And I click on "Add" Button
    And I click on "Done" Button
    Then I should that the Total Applied Amount has changed

    Examples:
    | receiptmethod |
    | RP EFT        |
    | RP CC         |
    | RP Check      |


  @TC33040 @smoke
  Scenario: AR_VS_019_Create Customer Receipt - On Account
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I create a transaction with the following details with certain Amount:
      | Business Unit      | RP US BU            |
      | Transaction Source | Manual              |
      | Transaction Type   | Invoice             |
      | Bill-to Name       | CROWN BAY GROUP LLC |
      | Ship-to Site       | 1000022579          |
      | Description        | Test                |
      | Quantity           | 1                   |
      |Amount              | 3,000.00            |
    And I logout from the Fusion Application
    And I login to the Fusion application with "RP_AR_Receipt_Processor" Persona
    When I navigate to the "Accounts Receivable" page under the "Receivables" section in the Navigator
    And I click on the "Create Receipt" from the Task Panel
    Then I should see "Create Receipt" Page
    When I create a Receipt with the following details:
    | Business Unit	 | RP US BU            |
    | Receipt Method | <receiptmethod>     |
    | Name           | CROWN BAY GROUP LLC |
    | Site           | 1100029358          |
    And I click in Add Icon to attach documents at the receipt header level
    And I click on "Submit" from "Submit and Create Another" dropdown
    Then I should see a popup with message Receipt has been created sucessfully
    When I click on "Accounts Receivable" in the Navigator
    And I click on the "Manage Receipts" from the Task Panel
    Then I should see "Manage Receipts" Page
    When I enter receipt number in the "Receipt Number" input box
    And I click on "Search" Button
    Then I should see the searched receipt
    When I click on Receipt Number link 
    Then I should see whole receipt amount displayed under Unapplied Amount
    When I click on "More" in the "Actions" Dropdown under the Application Tab
    And I click on "Create On-Account Application" from the options
    And I click on "OK" Button in the Popup
    And I click on "Save" Button
    Then I should see that the On-Account Amount has changed

    Examples:
    | receiptmethod |
    | RP EFT        |
    | RP CC         |
    | RP Check      |

 @TC33040 @smoke

  Scenario: AR_VS_019_Create Customer Receipt - Reversed
    Given I login to the Fusion application with "RP_AR_Invoice_Processor" Persona
    When I create a transaction with the following details with certain Amount:
      | Business Unit      | RP US BU            |
      | Transaction Source | Manual              |
      | Transaction Type   | Invoice             |
      | Bill-to Name       | CROWN BAY GROUP LLC |
      | Ship-to Site       | 1000022579          |
      | Description        | Test                |
      | Quantity           | 1                   |
      |Amount              | 3,000.00            |
    And I logout from the Fusion Application
    And I login to the Fusion application with "RP_AR_Receipt_Processor" Persona
    When I navigate to the "Accounts Receivable" page under the "Receivables" section in the Navigator
    And I click on the "Create Receipt" from the Task Panel
    Then I should see "Create Receipt" Page
    When I create a Receipt with the following details:
    | Business Unit	 | RP US BU            |
    | Receipt Method | <receiptmethod>     |
    | Name           | CROWN BAY GROUP LLC |
    | Site           | 1100029358          |
    And I click in Add Icon to attach documents at the receipt header level
    And I click on "Submit" from "Submit and Create Another" dropdown
    Then I should see a popup with message Receipt has been created sucessfully
    When I click on "Accounts Receivable" in the Navigator
    And I click on the "Manage Receipts" from the Task Panel
    Then I should see "Manage Receipts" Page
    When I enter receipt number in the "Receipt Number" input box
    And I click on "Search" Button
    Then I should see the searched receipt
    When I click on Receipt Number link 
    Then I should see whole receipt amount displayed under Unapplied Amount
    When I click on "Reverse" option from the "Actions" Dropdown at the Header Level
    And I enter the Category for Reversal as "Reverse payment"
    And I set the Reason for Reversal as "Payment reversal"
    And I click on "Reverse" Button in the "Reverse Receipt" Window
    Then I should see status as Reversed

    Examples:
    | receiptmethod |
    | RP EFT        |
    | RP CC         |
    | RP Check      |


@TC33040 @smoke

  Scenario: AR_VS_019_Create Customer Receipt - Inquire_Receipts

    Given I login to the Fusion application with "RP_AR_Receipt_Processor" Persona
    When I click on the "Receivables" option in the Navigator
    And I click on "Accounts Receivable" from the "Receivables" Dropdown in the Navigator
    And I click on the "Manage Receipts" from the Task Panel
    Then I should see "Manage Receipts" Page
    When I enter receipt number in the "Receipt Number" input box
    And I click on "Search" Button
    Then I should see the searched receipt
    When I click on Receipt Number link 
    Then I should see "Edit Receipt" Page and the following Receipt Information
    | Status | 
    |Business Unit |
    |Receipt Type |
    |Receipt Method |
    |Receipt Number |
    |Receivables Specialist |
    |Attachments |
    |Customer Account Number |
    | Customer Name |
    |Customer Site |
    |Receipt Date |
    |Accounting Date |
    |Comments |
    |Currency |
    |Accounted Amount |
    |Total Applied Amount |
    |On-Account Amount |
    |Unapplied Amount |
    |Exchange Gain or Loss|