import { BeforeAll, AfterAll, Before, After, Status, setDefaultTimeout, ITestCaseHookParameter } from "@cucumber/cucumber";
import { fixture } from "./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getCreds, getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";
import Assert from "../helper/wrapper/assert";
import { Console } from "winston/lib/winston/transports";
import DateUtil from "../helper/wrapper/DateUtils";
import excelUtil from "../helper/wrapper/excelUtils";
import AdoUtil from "../helper/util/adoUtil";
import otc_ReceivablesPage from "../pages/FaCT/otc_ReceivablesPage";

export let receivablesPage: otc_ReceivablesPage;
export let assert: Assert;
export let creds;
export let date: DateUtil;
export let excel: excelUtil;
export let adoUtil: AdoUtil;


const fs = require("fs-extra");
setDefaultTimeout(80 * 1000);
BeforeAll(async function () {

    getEnv();
    fixture.browser = await invokeBrowser();
    fixture.context = await fixture.browser.newContext();
    fixture.page = await fixture.context.newPage();
    await fixture.page.goto(process.env.BASEURL, { timeout: 20000 });

    await fixture.page.waitForLoadState('domcontentloaded'); // Waits for the DOMContentLoaded event
    await fixture.page.waitForLoadState('networkidle');

    assert = new Assert();
    date = new DateUtil();
    excel = new excelUtil();
    adoUtil = new AdoUtil();
    receivablesPage = new otc_ReceivablesPage(fixture.page)
});

Before(async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id
    fixture.context = await fixture.browser.newContext();
    fixture.page = fixture.page;
    fixture.logger = createLogger(options(scenarioName));
});

After({ timeout: 400000 }, async function ({ pickle, result }) {
    let img: Buffer;
    if (result?.status == Status.FAILED) {
        img = await fixture.page.screenshot({ path: `./test-results/screenshots/${pickle.name}.png`, type: "png" })
        await this.attach(
            img, "image/png"
        );
        await fixture.page.goto(process.env.BASEURL,{ timeout: 20000 });
        await fixture.page.waitForLoadState('domcontentloaded'); // Waits for the DOMContentLoaded event
        await fixture.page.waitForLoadState('networkidle');
        await receivablesPage.signOutFromFusion()
    }
    else if (result?.status == Status.PASSED){
        await receivablesPage.signOutFromFusion()
    }
});


AfterAll(async function () {
    await fixture.page.close();
    await fixture.context.close();
    await fixture.browser.close();
})

After({ timeout: 400000 },async function(scenario: ITestCaseHookParameter) {
   await adoUtil.updateTheTestPoint(scenario,scenario.result?.status);
});

