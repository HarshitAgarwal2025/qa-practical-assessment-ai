const { test } = require("@playwright/test");
const { POManager } = require("../../UI/pageobjects/POManager");
const checkoutData = require("../../UI/resources/data/checkoutData.json");
const utils = require('../../commonUtils/utils');

test.describe('Checkout', () => {
    /**Initialising variables to be used across test cases */
    let poManager = null;
    let productDiscoveryPage = null;
    let shoppingCartPage = null;
    let checkoutPage = null;

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);
        productDiscoveryPage = poManager.getProductDiscoveryPage();
        shoppingCartPage = poManager.getShoppingCartPage();
        checkoutPage = poManager.getCheckoutPage();
        await productDiscoveryPage.goto();
    });

    /**UI TC006 - Verify mandatory field validation during checkout */
    test('Verify mandatory field validation during checkout @regression', async ({ page }) => {
        await utils.addTestAnnotationsByKeyword("checkout_validation");

        // Precondition: cart contains at least one product
        await productDiscoveryPage.searchProduct(checkoutData.searchKeyword);
        await productDiscoveryPage.openFirstInStockProductDetails();
        await shoppingCartPage.addToCart();
        await shoppingCartPage.goToCart();

        // Step 1: Proceed to checkout
        await checkoutPage.proceedToCustomerInfo();

        // Steps 2–3: Leave mandatory fields blank and attempt to continue
        await checkoutPage.submitCustomerInfoForm();
        await checkoutPage.verifyMandatoryFieldErrors(
            checkoutData.mandatoryFields,
            checkoutData.expectedMessages
        );

        console.log('UI TC006 Passed');
    });
});
