const { test, expect } = require("@playwright/test");
const { commonMethods } = require("../../API/utilities/apiHelper");
const { _Response } = require("../../API/testdata/commonAPIResponse");
const { storeResponseToJsonFile } = require("../../API/utilities/storeFullAPIResponse");
const toolshopApiPage = require("../../API/pageobjects/toolshopLoginPage");
const suiteInfo = require("../../API/utilities/requestToCurlLogger");

test.beforeAll(async () => {
    suiteInfo.suiteStarter();
});

/** API TC002 - Verify successful login with valid credentials and obtain access token */
test("Verify successful Toolshop login returns a bearer access token @sanity @regression", async () => {
    test.info().annotations.push({ type: "test_key", description: "TC002" });

    const headers = toolshopApiPage.loginHeader;
    const endPoint = toolshopApiPage.loginEndpoint;
    const payload = toolshopApiPage.loginBody;
    const commonRequest = new commonMethods();
    const response = await commonRequest.PostResponse(endPoint, payload, headers);

    expect(response.status()).toBe(_Response.getPositive);
    expect.soft(response.ok()).toBeTruthy();

    const res = await response.json();
    expect(res.access_token).toBeTruthy();
    expect(res.token_type).toBe("bearer");
    expect(res.expires_in).toBeGreaterThan(0);

    const createJson = new storeResponseToJsonFile();
    createJson.storeJsonDataToFile(res, "toolshopAccessToken");

    console.log("API TC002 Passed");
});
