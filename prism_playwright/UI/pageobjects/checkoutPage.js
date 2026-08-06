const { expect } = require("@playwright/test");
const loggerUtilities = require("../../commonUtils/loggerUtil");

class checkoutPage {
    /**
     * Page Object for the Toolshop Checkout customer-information step.
     * Locators are derived from the live application DOM (Aug 2026).
     */
    constructor(page) {
        this.page = page;
        this.log  = new loggerUtilities();

        this.proceedCartBtn        = page.locator('[data-test="proceed-1"]');
        this.guestEmailInput       = page.locator('[data-test="guest-email"]');
        this.guestSubmitBtn        = page.locator('[data-test="guest-submit"]');
        this.billingStreetInput    = page.locator('[data-test="street"]');
        this.paymentMethod         = page.locator('[data-test="payment-method"]');
    }

    /** Proceed from the cart view to the guest customer-information step */
    async proceedToCustomerInfo() {
        await expect(this.page.locator('[data-test="product-title"]')).toBeVisible();
        await expect(this.proceedCartBtn).toBeVisible();
        await this.proceedCartBtn.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.getByRole('tab', { name: 'Continue as Guest' }).click();
        await expect(this.guestEmailInput).toBeVisible();
        this.log.logger("Proceeded to guest customer information step");
    }

    /** Submit the guest customer-information form without entering any details */
    async submitCustomerInfoForm() {
        await this.guestSubmitBtn.click();
        this.log.logger("Submitted guest customer information form with blank mandatory fields");
    }

    /**
     * Verify mandatory-field validation errors are shown and checkout remains blocked.
     *
     * @param {string[]} mandatoryFields - data-test field name prefixes (e.g. "guest-email").
     * @param {Object} expectedMessages - map of field name to expected error text.
     */
    async verifyMandatoryFieldErrors(mandatoryFields, expectedMessages) {
        for (const fieldName of mandatoryFields) {
            const errorEl = this.page.locator(`[data-test="${fieldName}-error"]`);
            await expect(errorEl).toBeVisible();
            await expect(errorEl).toHaveText(expectedMessages[fieldName]);
            this.log.logger(`Mandatory field validation verified for [${fieldName}]`);
        }

        await expect(this.billingStreetInput).not.toBeVisible();
        await expect(this.paymentMethod).not.toBeVisible();
        await expect(this.guestSubmitBtn).toBeVisible();
        this.log.logger("Checkout blocked — billing and payment steps not reached");
    }
}

module.exports = { checkoutPage };
