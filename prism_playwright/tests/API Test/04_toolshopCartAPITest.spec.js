const { test, expect } = require("@playwright/test");
const { commonMethods } = require("../../API/utilities/apiHelper");
const { _Response } = require("../../API/testdata/commonAPIResponse");
const { storeResponseToJsonFile } = require("../../API/utilities/storeFullAPIResponse");
const toolshopApiPage = require("../../API/pageobjects/toolshopLoginPage");
const toolshopCartData = require("../../API/testdata/toolshopCartData.json");
const suiteInfo = require("../../API/utilities/requestToCurlLogger");

test.beforeAll(async () => {
    suiteInfo.suiteStarter();
});

/** API TC005 - Get product list, add a product to cart and verify cart contents */
test("Verify product list, add to cart and cart contents @regression", async () => {
    test.info().annotations.push({ type: "test_key", description: "TC005" });

    const commonRequest = new commonMethods();
    const authHeaders = toolshopApiPage.getAuthHeader();

    const productsResponse = await commonRequest.GetResponse(
        toolshopApiPage.productsEndpoint,
        authHeaders
    );
    expect(productsResponse.status()).toBe(_Response.getPositive);
    expect.soft(productsResponse.ok()).toBeTruthy();

    const products = await productsResponse.json();
    expect(products.data.length).toBeGreaterThan(0);

    const product = products.data.find(
        (item) => item.name === toolshopCartData.productName
    );
    expect(product).toBeTruthy();
    expect(product.id).toBeTruthy();

    const createCartResponse = await commonRequest.PostResponse(
        toolshopApiPage.createCartEndpoint,
        toolshopApiPage.createCartBody,
        authHeaders
    );
    expect(createCartResponse.status()).toBe(_Response.postPositive);
    expect.soft(createCartResponse.ok()).toBeTruthy();

    const cart = await createCartResponse.json();
    expect(cart.id).toBeTruthy();

    const addItemPayload = {
        ...toolshopApiPage.addCartItemBody,
        product_id: product.id,
    };
    const addItemResponse = await commonRequest.PostResponse(
        toolshopApiPage.addCartItemEndpoint(cart.id),
        addItemPayload,
        authHeaders
    );
    expect(addItemResponse.status()).toBe(_Response.getPositive);
    expect.soft(addItemResponse.ok()).toBeTruthy();

    const addItemResult = await addItemResponse.json();
    expect(addItemResult.result).toBe(toolshopApiPage.expectedAddToCartResult);

    const cartResponse = await commonRequest.GetResponse(
        toolshopApiPage.getCartEndpoint(cart.id),
        authHeaders
    );
    expect(cartResponse.status()).toBe(_Response.getPositive);
    expect.soft(cartResponse.ok()).toBeTruthy();

    const cartDetails = await cartResponse.json();
    expect(cartDetails.id).toBe(cart.id);
    expect(cartDetails.cart_items.length).toBe(1);
    expect(cartDetails.cart_items[0].product_id).toBe(product.id);
    expect(cartDetails.cart_items[0].quantity).toBe(toolshopCartData.quantity);
    expect(cartDetails.cart_items[0].product.name).toBe(toolshopCartData.productName);

    const storeJson = new storeResponseToJsonFile();
    storeJson.storeJsonDataToFile({ id: cartDetails.id }, "toolshopCart");

    console.log("API TC005 Passed");
});
