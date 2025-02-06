import { Locator, FrameLocator} from "@playwright/test";
import { fixture } from '../../hooks/pageFixture';

export default class PlaywrightWrapper {

    async goto(url: string) {
        await fixture.page.goto(url, {
            waitUntil: "domcontentloaded"
        });
    }

    async waitAndClick(locator: string) {
        const element = fixture.page.locator(locator);
        await element.waitFor({
            state: "visible"
        });
        await element.click();
    }

    async navigateTo(link: string) {
        await Promise.all([
            fixture.page.waitForNavigation(),
            fixture.page.click(link)
        ])
    }

    async wait(timeout: number) {
        await fixture.page.waitForTimeout(timeout);
    }

    async isElementVisible(element:Locator): Promise<boolean> {
        return await element.isVisible({timeout: 25000});
    }
    async frameLocator(selector: string): Promise<FrameLocator> {
        return fixture.page.frameLocator(selector);
    }

}