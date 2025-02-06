import { Locator, expect } from "@playwright/test";
import { fixture } from "../../hooks/pageFixture";

export default class Assert {

    async assertTitle(title: string) {
        await expect(fixture.page).toHaveTitle(title, {timeout:60000});
    }

    async assertTitleContains(title: string) {
        const pageTitle = await fixture.page.title();
        console.log(pageTitle);
        expect(pageTitle).toContain(title);
    }

    async assertURL(url: string) {
        await expect(fixture.page).toHaveURL(url);
    }

    async assertURLContains(title: string) {
        const pageURL = fixture.page.url();
        expect(pageURL).toContain(title);
    }

    async assertEquals(actual:string|number|Error, expected:string|number|Error) {
        expect(actual).toBe(expected);
    }

    async assertValueToBeGreaterThan(value:number, target:number) {
        expect(value).toBeGreaterThan(target);
    }
    async assertEqualsContains(actual:string|number, expected:string|number) {
        expect(actual).toContain(expected);
    }

    async assertTrue(value:boolean) {
        expect(value).toBeTruthy();
    }
    async assertFalse(value:boolean) {
        expect(value).toBeFalsy();
    }

    async assertTrueWithMessage(condition: boolean, message?: string): Promise<void> {
        if (!condition) {
            throw new Error(message || "Assertion failed");
        }
    }

    async assertFalseWithMessage(condition: boolean, message?: string): Promise<void> {
        if (condition) {
            throw new Error(message || "Assertion failed");
        }
    }
    

}