const { test, expect } = require("@playwright/test");
const { POManager } = require("../../UI/pageobjects/POManager");
const login = require("../../UI/resources/data/loginData.json");
const { registerToolshopUser } = require("../../UI/utilities/toolshopUserHelper");
const utils = require('../../commonUtils/utils');

test.describe('User Login', () => {
    /**Initialising variables to be used across test cases */
    let poManager  = null;
    let loginPage  = null;
    const invalidUsername = login.invalidCredentials.username;
    const invalidPassword = login.invalidCredentials.password;

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);
        loginPage = poManager.getLoginPage();
    });

    /**UI TC002 - Verify successful login with valid credentials */
    test('Verify successful login with valid credentials @Smoke @regression', async ({ page }) => {
        await utils.addTestAnnotationsByKeyword("toolshop_login");
        const user = await registerToolshopUser(page);
        await loginPage.loginToolshopUser(user.email, user.password);
        await loginPage.verifyToolshopLoginSuccess();
        console.log('UI TC002 Passed');
    });

    /**UI TC003 - Verify login validation for invalid and mandatory field inputs */
    test('Verify login validation for invalid and mandatory field inputs @regression', async ({ page }) => {
        await loginPage.gotoToolshop();
        await utils.addTestAnnotationsByKeyword("toolshop_login_validation");

        // Step 1: Leave mandatory fields blank and attempt login
        await loginPage.submitToolshopLoginForm();
        await loginPage.verifyToolshopMandatoryFieldErrors(
            login.expectedMessages.emailRequired,
            login.expectedMessages.passwordRequired
        );

        // Step 2: Enter invalid credentials and attempt login
        await loginPage.loginToolshopUser(invalidUsername, invalidPassword);
        await loginPage.verifyToolshopInvalidLoginError(login.expectedMessages.invalidLogin);
        console.log('UI TC003 Passed');
    });
});
