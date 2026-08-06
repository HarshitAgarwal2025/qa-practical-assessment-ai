const { expect } = require("@playwright/test");
const loggerUtilities = require("../../commonUtils/loggerUtil");

class shoppingCartPage {
    /**
     * Page Object for Toolshop product-detail cart actions and checkout cart view.
     * Locators are derived from the live application DOM (Aug 2026).
     */
    constructor(page) {
        this.page = page;
        this.log  = new loggerUtilities();

        // Product detail page
        this.unitPrice          = page.locator('[data-test="unit-price"]');
        this.productDetailQty   = page.locator('[data-test="quantity"]');
        this.addToCartBtn       = page.locator('[data-test="add-to-cart"]');

        // Header cart badge
        this.navCartQuantity    = page.locator('[data-test="cart-quantity"]');

        // Checkout / cart view
        this.productTitle       = page.locator('[data-test="product-title"]');
        this.cartItemQuantity   = page.locator('[data-test="product-quantity"]');
        this.productPrice       = page.locator('[data-test="product-price"]');
        this.linePrice          = page.locator('[data-test="line-price"]');
        this.cartTotal          = page.locator('[data-test="cart-total"]');
        this.navCart            = page.locator('[data-test="nav-cart"]');
    }

    /** Returns the unit price displayed on the product detail page */
    async getUnitPrice() {
        await expect(this.unitPrice).toBeVisible();
        const priceText = await this.unitPrice.textContent();
        const unitPrice = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        this.log.logger("Unit price on product detail: " + unitPrice);
        return unitPrice;
    }

    /** Add the current product to the cart from the product detail page */
    async addToCart() {
        await expect(this.addToCartBtn).toBeVisible();
        await this.addToCartBtn.click();
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Clicked Add to cart on product detail page");
    }

    /** Verify the header cart badge reflects the expected total item quantity */
    async verifyNavCartQuantity(expectedQuantity) {
        await expect(this.navCartQuantity).toBeVisible();
        await expect(this.navCartQuantity).toHaveText(String(expectedQuantity));
        this.log.logger("Nav cart quantity verified: " + expectedQuantity);
    }

    /** Open the checkout cart view via the header cart link */
    async goToCart() {
        await this.navCart.click();
        await this.page.waitForURL('**/checkout');
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Navigated to checkout cart view");
    }

    /** Update the cart line-item quantity on the checkout page */
    async updateCartItemQuantity(quantity) {
        await expect(this.cartItemQuantity).toBeVisible();
        await this.cartItemQuantity.fill(String(quantity));
        await this.cartItemQuantity.press('Tab');
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Updated cart item quantity to: " + quantity);
    }

    /** Verify cart line and total prices match unit price × quantity */
    async verifyCartTotals(unitPrice, quantity) {
        const expectedTotal = parseFloat((unitPrice * quantity).toFixed(2));

        await expect(this.cartItemQuantity).toHaveValue(String(quantity));

        await expect(async () => {
            const linePrice = parseFloat((await this.linePrice.textContent()).replace(/[^0-9.]/g, ''));
            const cartTotal = parseFloat((await this.cartTotal.textContent()).replace(/[^0-9.]/g, ''));
            expect(linePrice).toBe(expectedTotal);
            expect(cartTotal).toBe(expectedTotal);
        }).toPass({ timeout: 15000 });

        await expect(this.navCartQuantity).toHaveText(String(quantity));

        this.log.logger("Cart totals verified — quantity: " + quantity + ", total: " + expectedTotal);
    }

    /** Verify the expected product name is shown in the checkout cart view */
    async verifyProductInCart(productName) {
        await expect(this.productTitle).toBeVisible();
        await expect(this.productTitle).toHaveText(productName);
        this.log.logger("Product in cart verified: " + productName);
    }
}

module.exports = { shoppingCartPage };
