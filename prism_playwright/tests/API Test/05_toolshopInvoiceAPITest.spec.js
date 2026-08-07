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

/** API TC007 - Generate invoice from existing cart and verify the response */
test("Verify invoice generation and invoice response @sanity @regression", async () => {
    test.info().annotations.push({ type: "test_key", description: "TC007" });

    const commonRequest = new commonMethods();
    const authHeaders = toolshopApiPage.getAuthHeader();

    const userProfileResponse = await commonRequest.GetResponse(
        toolshopApiPage.usersMeEndpoint,
        authHeaders
    );
    expect(userProfileResponse.status()).toBe(_Response.getPositive);
    expect.soft(userProfileResponse.ok()).toBeTruthy();

    const userProfile = await userProfileResponse.json();
    expect(userProfile.address).toBeTruthy();
    expect(userProfile.address.street).toBeTruthy();
    expect(userProfile.address.city).toBeTruthy();
    expect(userProfile.address.country).toBeTruthy();

    const invoiceBody = toolshopApiPage.getInvoiceBody(userProfile.address);

    const invoiceResponse = await commonRequest.PostResponse(
        toolshopApiPage.createInvoiceEndpoint,
        invoiceBody,
        authHeaders
    );
    expect(invoiceResponse.status()).toBe(_Response.postPositive);
    expect.soft(invoiceResponse.ok()).toBeTruthy();

    const invoice = await invoiceResponse.json();
    expect(invoice.id).toBeTruthy();
    expect(invoice.invoice_number).toMatch(
        new RegExp(`^${toolshopApiPage.invoiceNumberPrefix}`)
    );
    expect(invoice.billing_street).toBe(invoiceBody.billing_street);
    expect(invoice.billing_city).toBe(invoiceBody.billing_city);
    expect(invoice.billing_country).toBe(invoiceBody.billing_country);
    expect(invoice.total).toBeGreaterThan(0);

    const storeJson = new storeResponseToJsonFile();
    storeJson.storeJsonDataToFile(invoice, "toolshopInvoice");

    const getInvoiceResponse = await commonRequest.GetResponse(
        toolshopApiPage.getInvoiceEndpoint(invoice.id),
        authHeaders
    );
    expect(getInvoiceResponse.status()).toBe(_Response.getPositive);
    expect.soft(getInvoiceResponse.ok()).toBeTruthy();

    const invoiceDetails = await getInvoiceResponse.json();
    expect(invoiceDetails.id).toBe(invoice.id);
    expect(invoiceDetails.invoice_number).toBe(invoice.invoice_number);
    expect(invoiceDetails.invoicelines.length).toBeGreaterThan(0);
    expect(invoiceDetails.invoicelines[0].product.name).toBe(
        toolshopCartData.productName
    );

    console.log("API TC007 Passed");
});
