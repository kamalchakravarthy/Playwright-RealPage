import { ITestCaseHookParameter } from "@cucumber/cucumber";
import axios from "axios";
export let response;

let adoTcIdTag;
let taglength;


export default class AdoUtil {
  constructor() {}
  async updateTheTestPoint(scenario: ITestCaseHookParameter, outcome: string) {
    console.log(scenario.pickle.name + ":::" + outcome);
    adoTcIdTag = scenario.pickle.tags.find((t) => t.name.startsWith("@ado_"));
    if (!adoTcIdTag) {
      console.log(
        `No ADO Test Case ID found for scenario: ${scenario.pickle.name}`
      );
      return;
    }
    taglength = adoTcIdTag.name.split("_").length;
    const adoTsId = parseInt(adoTcIdTag.name.split("_")[1], 10);
    let tcIDs: number[] = new Array(taglength-1);
    console.log("lenght "+ taglength)
    for (let i = 0; i < tcIDs.length; i++) {
        tcIDs[i] = parseInt(adoTcIdTag.name.split("_")[`${(i+1)}`], 10);
        
    }
    console.log(tcIDs);

    for (let i = 1; i < tcIDs.length; i++) {
        const getAvailableTestPlansBasicurl: string =
        process.env.getAvailableTestPlansBasicurl;
      const testPlan = await this.getTestPlansInProject(getAvailableTestPlansBasicurl);
      console.log("test plan" + testPlan)
      const getTestpointUsingTestcaseNumber = `https://dev.azure.com/RealPage-FaCT/FaCT/_apis/testplan/Plans/${testPlan}/suites/${tcIDs[0]}/TestCase/${tcIDs[i]}?api-version=7.1`;
      console.log("getTestpointUsingTestcaseNumber" + getTestpointUsingTestcaseNumber)
      const testPointID = await this.getTestPointUsingTestcase(getTestpointUsingTestcaseNumber);
      const data = {
          "id": `${tcIDs[i]}`,
         "outcome": `${outcome}`,
          "Comment": "Test executed successfully."
       };
       const updateTheStatusOfTheTC = `https://dev.azure.com/RealPage-FaCT/FaCT/_apis/test/Plans/${testPlan}/Suites/${tcIDs[0]}/points/${testPointID}?api-version=7.1`;
       
       await this.UpdateTheTestPointWithOutComeStatus(updateTheStatusOfTheTC, outcome, data);
    }
    }
    

  async getTestPlansInProject(url: string):Promise<string> {
    response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`:${process.env.TOKEN}`)}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const dataa = await response.json();

    const entry = dataa.value.find((plan) => plan.name === "Release .5a FCCS");
    if (entry) {
      console.log("Data related to plan", entry.id);
    } else {
      console.log("No Data related to plan");
    }

    let testPlan = entry.id;
    console.log("Test Plan " + testPlan);
    return testPlan;
  }

  async getTestPointUsingTestcase(getTestpointUsingTestcaseNumber):Promise<string>  {
      

      response = await fetch(getTestpointUsingTestcaseNumber, {
         method: 'GET',
         headers: {
             'Content-Type': 'application/json',
             'Authorization': `Basic ${btoa(`:${process.env.TOKEN}`)}` // Encode PAT
         }
     });
     if (!response.ok) {
         throw new Error(`Error: ${response.statusText}`);
     }

     const dataaa = await response.json();
     const testPointID = dataaa.value[0].pointAssignments[0].id;
     console.log("Test Point ID "+testPointID)
     return testPointID;
  }

  async UpdateTheTestPointWithOutComeStatus(url, outcome: string, data ) {
      fetch(url, {
           method: 'PATCH',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Basic ${btoa(`:${process.env.TOKEN}`)}` // Encode PAT
           },
           body: JSON.stringify(data)
       })
       .then(response => {
           if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
           }
           return response.json();
       })
       .then(data => {
           console.log('Update successful:', data);
       })
       .catch(error => {
           console.error('Error updating point:', error);
       });
  }
}


