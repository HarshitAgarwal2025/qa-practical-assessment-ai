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
        this.proceedLoggedInBtn     = page.locator('[data-test="proceed-2"]');
        this.guestEmailInput       = page.locator('[data-test="guest-email"]');
        this.guestFirstNameInput   = page.locator('[data-test="guest-first-name"]');
        this.guestLastNameInput    = page.locator('[data-test="guest-last-name"]');
        this.guestSubmitBtn        = page.locator('[data-test="guest-submit"]');
        this.billingCountrySelect  = page.locator('[data-test="country"]');
        this.billingPostalCode     = page.locator('[data-test="postal_code"]');
        this.billingHouseNumber    = page.locator('[data-test="house_number"]');
        this.billingStreetInput    = page.locator('[data-test="street"]');
        this.billingCityInput      = page.locator('[data-test="city"]');
        this.billingStateInput     = page.locator('[data-test="state"]');
        this.proceedPaymentBtn     = page.locator('[data-test="proceed-3"]');
        this.paymentMethod         = page.locator('[data-test="payment-method"]');
        this.placeOrderBtn         = page.locator('[data-test="finish"]');
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

    /** Proceed from cart to billing when the user is already signed in */
    async proceedToCheckoutLoggedIn() {
        await expect(this.page.locator('[data-test="product-title"]')).toBeVisible();
        await expect(this.proceedCartBtn).toBeVisible();
        await this.proceedCartBtn.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.proceedLoggedInBtn).toBeVisible();
        await this.proceedLoggedInBtn.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.billingStreetInput).toBeVisible();
        this.log.logger("Proceeded to billing step as logged-in user");
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

    /**
     * Fill the guest customer-information form with valid details.
     *
     * @param {{ email: string, firstName: string, lastName: string }} customerInfo
     */
    async fillGuestCustomerInfo(customerInfo) {
        await this.guestEmailInput.fill(customerInfo.email);
        await this.guestFirstNameInput.fill(customerInfo.firstName);
        await this.guestLastNameInput.fill(customerInfo.lastName);
        this.log.logger("Filled guest customer information for: " + customerInfo.email);
    }

    /** Submit the completed guest customer-information form */
    async submitGuestCustomerInfoForm() {
        await this.guestSubmitBtn.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.billingStreetInput).toBeVisible();
        this.log.logger("Submitted guest customer information — billing step reached");
    }

    /**
     * Fill the billing address section on the checkout page.
     *
     * @param {{ country: string, postalCode: string, houseNumber: string,
     *          street: string, city: string, state: string }} address
     */
    async fillBillingAddress(address) {
        await this.billingCountrySelect.selectOption(address.country);
        await this.billingPostalCode.fill(address.postalCode);
        await this.page.waitForTimeout(500);
        await this.billingStreetInput.fill(address.street);
        await this.billingCityInput.fill(address.city);
        await this.billingStateInput.fill(address.state);
        await this.billingHouseNumber.fill(address.houseNumber);
        await expect(this.billingHouseNumber).toHaveValue(address.houseNumber);
        this.log.logger("Filled billing address for postal code: " + address.postalCode);
    }

    /** Proceed from billing address to the payment step */
    async proceedToPayment() {
        await expect(this.proceedPaymentBtn).toBeVisible();
        await this.proceedPaymentBtn.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.paymentMethod).toBeVisible();
        this.log.logger("Proceeded to payment step");
    }

    /** Select a payment method by its visible label */
    async selectPaymentMethod(paymentLabel) {
        await this.paymentMethod.selectOption({ label: paymentLabel });
        await expect(this.placeOrderBtn).toBeEnabled({ timeout: 15000 });
        this.log.logger("Selected payment method: " + paymentLabel);
    }

    /** Click the Confirm button twice to validate the payment step */
    async clickConfirmTwice() {
        await expect(this.placeOrderBtn).toBeEnabled();
        await this.placeOrderBtn.click();
        await expect(this.placeOrderBtn).toBeEnabled();
        await this.placeOrderBtn.click();
    }

    /** Click the Confirm button twice to generate the invoice */
    async clickConfirmTwiceToGenerateInvoice() {
        await expect(this.placeOrderBtn).toBeEnabled();
        await this.placeOrderBtn.click();
        await this.placeOrderBtn.click();
    }

    /**
     * Confirm payment, place the order, and verify the invoice confirmation message.
     *
     * The payment step requires two rounds of double-clicks on Confirm:
     *   1. Click Confirm twice to validate payment — "Payment was successful" is shown.
     *   2. Click Confirm twice again to generate the invoice.
     *
     * @param {string} messagePrefix - Expected start of the invoice confirmation message.
     */
    async placeOrder(messagePrefix) {
        await this.placeOrderBtn.scrollIntoViewIfNeeded();

        await this.clickConfirmTwice();
        await expect(this.page.getByText('Payment was successful')).toBeVisible({ timeout: 15000 });
        this.log.logger("Payment was successful message displayed");

        await this.clickConfirmTwiceToGenerateInvoice();
        await this.verifyOrderConfirmation(messagePrefix);
        this.log.logger("Clicked Confirm twice again to generate invoice");
    }

    /**
     * Verify the invoice confirmation message is displayed after successful order placement.
     *
     * @param {string} messagePrefix - Expected start of the invoice message
     *        (e.g. "Thanks for your order! Your invoice number is INV-").
     */
    async verifyOrderConfirmation(messagePrefix) {
        const invoiceMessage = this.page.getByText(new RegExp(`${messagePrefix}.+`));
        await expect(invoiceMessage).toBeVisible();
        this.log.logger("Order placement confirmed — invoice message displayed");
    }
}

module.exports = { checkoutPage };
