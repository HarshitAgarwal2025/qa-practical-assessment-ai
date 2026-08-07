const { test } = require("@playwright/test");
const { POManager } = require("../../UI/pageobjects/POManager");
const orderData = require("../../UI/resources/data/orderPlacementData.json");
const { registerToolshopUser } = require("../../UI/utilities/toolshopUserHelper");
const utils = require('../../commonUtils/utils');

test.describe('Order Placement', () => {
    /**Initialising variables to be used across test cases */
    let poManager = null;
    let loginPage = null;
    let productDiscoveryPage = null;
    let shoppingCartPage = null;
    let checkoutPage = null;

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);
        loginPage = poManager.getLoginPage();
        productDiscoveryPage = poManager.getProductDiscoveryPage();
        shoppingCartPage = poManager.getShoppingCartPage();
        checkoutPage = poManager.getCheckoutPage();
    });

    /**UI TC007 - Verify complete purchase journey from login to order confirmation */
    test('Verify complete purchase journey from login to order confirmation @sanity @regression', async ({ page }) => {
        await utils.addTestAnnotationsByKeyword("order_placement");

        // Step 1: Login
        const user = await registerToolshopUser(page);
        await loginPage.loginToolshopUser(user.email, user.password);
        await loginPage.verifyToolshopLoginSuccess();

        // Steps 2–4: Search product, view details and add to cart
        await productDiscoveryPage.goto();
        await productDiscoveryPage.searchProduct(orderData.searchKeyword);
        await productDiscoveryPage.openFirstInStockProductDetails();
        await shoppingCartPage.addToCart();
        await shoppingCartPage.verifyNavCartQuantity(orderData.quantity);
        await shoppingCartPage.goToCart();

        // Steps 5–6: Checkout and place order
        await checkoutPage.proceedToCheckoutLoggedIn();
        await checkoutPage.fillBillingAddress({
            country: user.country,
            postalCode: user.postalCode,
            houseNumber: user.houseNumber,
            street: user.street,
            city: user.city,
            state: user.state
        });
        await checkoutPage.proceedToPayment();
        await checkoutPage.selectPaymentMethod(orderData.paymentMethod);
        await checkoutPage.placeOrder(orderData.invoiceConfirmationPrefix);

        console.log('UI TC007 Passed');
    });
});
