import { Page } from "@playwright/test";
import PlaywrightWrapper from "../helper/wrapper/PlaywrightWrappers";
import { fixture } from "../hooks/pageFixture";

export default class fusionNavigatorPage {
    private base: PlaywrightWrapper;
    private page: Page

    constructor(page: Page) {
        this.page = page;
        this.base = new PlaywrightWrapper();
    }
}