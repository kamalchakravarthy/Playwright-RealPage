import { Browser, BrowserContext, Page } from "@playwright/test";
import { Logger } from "winston";

export const fixture = {
    // @ts-ignore
    browser: undefined as Browser,
    context: undefined as BrowserContext,
    page: undefined as Page,
    logger: undefined as Logger
}