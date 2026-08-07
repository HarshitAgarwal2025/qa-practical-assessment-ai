const { expect } = require("@playwright/test");
const loggerUtilities = require("../../commonUtils/loggerUtil");

class productDiscoveryPage {
    /**
     * Page Object for the Toolshop Product Discovery (catalog) page.
     * Locators are derived from the live application DOM (Aug 2026).
     */
    constructor(page) {
        this.page = page;
        this.log  = new loggerUtilities();

        this.searchInput   = page.locator('[data-test="search-query"]');
        this.searchSubmit  = page.locator('[data-test="search-submit"]');
        this.sortDropdown  = page.locator('[data-test="sort"]');
        this.productNames  = page.locator('[data-test="product-name"]');
        this.productPrices = page.locator('[data-test="product-price"]');
    }

    /** Navigate to the Toolshop product catalog (home page) */
    async goto() {
        await this.page.goto(process.env.BASE_URL);
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Navigated to Toolshop product catalog");
    }

    /** Search for products using the catalog search bar */
    async searchProduct(keyword) {
        await this.searchInput.fill(keyword);
        await this.searchSubmit.click();
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Searched for product keyword: " + keyword);
    }

    /** Apply a category filter by its visible label */
    async applyCategoryFilter(categoryName) {
        const categoryCheckbox = this.page.getByLabel(categoryName, { exact: true });
        await categoryCheckbox.check();
        await expect(categoryCheckbox).toBeChecked();
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Applied category filter: " + categoryName);
    }

    /** Apply a brand filter by its visible label */
    async applyBrandFilter(brandName) {
        const brandCheckbox = this.page.getByLabel(brandName, { exact: true });
        await brandCheckbox.check();
        await expect(brandCheckbox).toBeChecked();
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Applied brand filter: " + brandName);
    }

    /** Select a sorting option from the sort dropdown */
    async applySorting(sortValue) {
        await this.sortDropdown.selectOption(sortValue);
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Applied sorting option: " + sortValue);
    }

    /** Verify every visible product name contains the search keyword (case-insensitive) */
    async verifySearchResults(keyword) {
        await expect(this.productNames.first()).toBeVisible();
        const names = await this.getProductNames();
        const lowerKeyword = keyword.toLowerCase();
        names.forEach((name) => {
            expect(name.toLowerCase()).toContain(lowerKeyword);
        });
        this.log.logger("Search results verified for keyword: " + keyword);
    }

    /** Verify filtered results remain visible and still match the search keyword */
    async verifyFilteredResults(keyword) {
        await expect(this.productNames.first()).toBeVisible();
        const names = await this.getProductNames();
        expect(names.length).toBeGreaterThan(0);
        const lowerKeyword = keyword.toLowerCase();
        names.forEach((name) => {
            expect(name.toLowerCase()).toContain(lowerKeyword);
        });
        this.log.logger("Filtered results verified — " + names.length + " product(s) displayed");
    }

    /** Verify product prices are sorted in descending order */
    async verifyPricesSortedDescending() {
        const prices = await this.getProductPrices();
        expect(prices.length).toBeGreaterThan(0);
        for (let i = 1; i < prices.length; i++) {
            expect(prices[i - 1]).toBeGreaterThanOrEqual(prices[i]);
        }
        this.log.logger("Product prices verified in descending order");
    }

    /** Open the product detail page for the first product in the current listing */
    async openFirstProductDetails() {
        const productLink = this.page.locator('a [data-test="product-name"]').first();
        await expect(productLink).toBeVisible();
        await productLink.click();
        await this.page.waitForURL('**/product/**');
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Opened product details for the first listed product");
    }

    /** Open product details for the first in-stock product in the current listing */
    async openFirstInStockProductDetails() {
        const productLinks = this.page.locator('a [data-test="product-name"]');
        await expect(productLinks.first()).toBeVisible();
        const count = await productLinks.count();

        for (let i = 0; i < count; i++) {
            await productLinks.nth(i).click();
            await this.page.waitForURL('**/product/**');
            await this.page.waitForLoadState('networkidle');

            const addToCartBtn = this.page.locator('[data-test="add-to-cart"]');
            if (await addToCartBtn.isEnabled()) {
                this.log.logger("Opened in-stock product details from listing position: " + (i + 1));
                return;
            }

            await this.page.goBack();
            await this.page.waitForLoadState('networkidle');
        }

        throw new Error('No in-stock product found in the current listing');
    }

    /** Returns trimmed product names currently displayed on the page */
    async getProductNames() {
        const names = await this.productNames.allTextContents();
        return names.map((name) => name.trim());
    }

    /** Returns numeric product prices currently displayed on the page */
    async getProductPrices() {
        const prices = await this.productPrices.allTextContents();
        return prices.map((price) => parseFloat(price.replace(/[^0-9.]/g, '')));
    }
}

module.exports = { productDiscoveryPage };
