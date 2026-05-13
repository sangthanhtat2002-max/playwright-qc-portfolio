import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
    readonly productList: Locator;
    readonly cartBadge: Locator;
    readonly sortDropdown: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        super(page);
        this.productList = page.locator('.inventory_list');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
        this.cartLink = page.locator('.shopping_cart_link');
    }

    async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.sortDropdown.selectOption(option);
    }

    async addToCartByName(productId: string) {
        await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
    }

    async removeFromCartByName(productId: string) {
        await this.page.locator(`[data-test="remove-${productId}"]`).click();
    }

    async getCartCount(): Promise<string> {
        return await this.cartBadge.innerText();
    }

    async goToCart() {
        await this.cartLink.click();
    }

    async getFirstProductName(): Promise<string> {
        return await this.page.locator('.inventory_item_name').first().innerText();
    }

    async getFirstProductPrice(): Promise<string> {
        return await this.page.locator('.inventory_item_price').first().innerText();
    }
}