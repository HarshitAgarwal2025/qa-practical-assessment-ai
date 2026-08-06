const { test } = require("@playwright/test");
const { POManager } = require("../../UI/pageobjects/POManager");
const cartData = require("../../UI/resources/data/shoppingCartData.json");
const utils = require('../../commonUtils/utils');

test.describe('Shopping Cart', () => {
    /**Initialising variables to be used across test cases */
    let poManager = null;
    let productDiscoveryPage = null;
    let shoppingCartPage = null;

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);
        productDiscoveryPage = poManager.getProductDiscoveryPage();
        shoppingCartPage = poManager.getShoppingCartPage();
        await productDiscoveryPage.goto();
    });

    /**UI TC005 - Verify adding products to cart and updating product quantity */
    test('Verify adding products to cart and updating product quantity @sanity @regression', async ({ page }) => {
        await utils.addTestAnnotationsByKeyword("shopping_cart");

        // Step 1: Open product details
        await productDiscoveryPage.searchProduct(cartData.searchKeyword);
        await productDiscoveryPage.openFirstProductDetails();
        const unitPrice = await shoppingCartPage.getUnitPrice();

        // Step 2: Add product to cart
        await shoppingCartPage.addToCart();
        await shoppingCartPage.verifyNavCartQuantity(cartData.initialQuantity);

        // Step 3: Update quantity and verify cart totals
        await shoppingCartPage.goToCart();
        await shoppingCartPage.verifyProductInCart(cartData.productName);
        await shoppingCartPage.updateCartItemQuantity(cartData.updatedQuantity);
        await shoppingCartPage.verifyCartTotals(unitPrice, cartData.updatedQuantity);

        console.log('UI TC005 Passed');
    });
});
