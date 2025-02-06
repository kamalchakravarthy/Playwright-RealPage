Feature: FCCS Testcase

  @TC29136
  Scenario: Consolidation Data, Run Consolidation
     Given I login to the FCCS application as FinRep service adminstrator User 
     When I click on "Navigator" on the home page
     And I click on "Rules"
     Then I should see "Rules" page
     When I click on "Launch" button for the "Consolidate" Rule
     And I click on "Launch" button 
     Then I should see Process Completion dialog box


