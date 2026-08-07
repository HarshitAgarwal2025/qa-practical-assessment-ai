const { test, expect } = require("@playwright/test");
const { POManager } = require("../../UI/pageobjects/POManager");
const { generateToolshopUser } = require("../../UI/utilities/toolshopUserHelper");
const utils = require('../../commonUtils/utils');

test.describe('User Registration', () => {
    /**Initialising variables to be used across test cases */
    let poManager = null;
    let registrationPage = null;
    const userData = generateToolshopUser();

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);
        registrationPage = poManager.getRegistrationPage();
        await registrationPage.goto();
    });

    /**UI TC001 - Verify successful user registration with valid details */
    test('Verify successful user registration with valid details @Smoke @regression', async ({ page }) => {
        await utils.addTestAnnotationsByKeyword("registration");
        await registrationPage.fillRegistrationForm(userData);
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyRegistrationSuccess();
        console.log('UI TC001 Passed');
    });
});
