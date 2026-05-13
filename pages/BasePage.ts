import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: string = '') {
        await this.page.goto(`${process.env.BASE_URL}${path}`);
    }

    async getTitle(): Promise<string> {
        return await this.page.title();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }
}