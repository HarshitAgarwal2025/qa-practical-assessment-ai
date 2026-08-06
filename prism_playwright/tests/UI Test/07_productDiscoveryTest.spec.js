const { test } = require("@playwright/test");
const { POManager } = require("../../UI/pageobjects/POManager");
const productData = require("../../UI/resources/data/productDiscoveryData.json");
const utils = require('../../commonUtils/utils');

test.describe('Product Discovery', () => {
    /**Initialising variables to be used across test cases */
    let poManager = null;
    let productDiscoveryPage = null;

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);
        productDiscoveryPage = poManager.getProductDiscoveryPage();
        await productDiscoveryPage.goto();
    });

    /**UI TC004 - Verify product search, filter and sorting functionality */
    test('Verify product search, filter and sorting functionality @sanity @regression', async ({ page }) => {
        await utils.addTestAnnotationsByKeyword("product_discovery");

        // Step 1: Search for a product
        await productDiscoveryPage.searchProduct(productData.searchKeyword);
        await productDiscoveryPage.verifySearchResults(productData.searchKeyword);

        // Step 2: Apply category/brand filters
        await productDiscoveryPage.applyCategoryFilter(productData.category);
        await productDiscoveryPage.applyBrandFilter(productData.brand);
        await productDiscoveryPage.verifyFilteredResults(productData.searchKeyword);

        // Step 3: Apply sorting option
        await productDiscoveryPage.applySorting(productData.sort.priceHighToLow);
        await productDiscoveryPage.verifyPricesSortedDescending();

        console.log('UI TC004 Passed');
    });
});
