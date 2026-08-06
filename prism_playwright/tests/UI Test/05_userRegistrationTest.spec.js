const { test, expect } = require("@playwright/test");
const { POManager } = require("../../UI/pageobjects/POManager");
const { faker } = require('@faker-js/faker/locale/en');
const registrationData = require("../../UI/resources/data/registrationData.json");
const utils = require('../../commonUtils/utils');

test.describe('User Registration', () => {
    /**Initialising variables to be used across test cases */
    let poManager = null;
    let registrationPage = null;

    /*
     * Build a unique user on each run so the email never collides with
     * an existing account in the Toolshop application.
     * houseNumber, country, phone, dob are fixed via registrationData.json.
     * street, city, state, postalCode, firstName, lastName, email are faker-generated.
     * password is dynamically constructed to satisfy the application's password policy
     * (uppercase + lowercase + digits + special character) and avoid the common-password list.
     */
    const userData = {
        firstName:   faker.person.firstName(),
        lastName:    faker.person.lastName(),
        dob:         registrationData.validUser.dob,
        phone:       registrationData.validUser.phone,
        houseNumber: registrationData.validUser.houseNumber,
        street:      faker.location.street(),
        city:        faker.location.city(),
        state:       faker.location.state(),
        country:     registrationData.validUser.country,
        postalCode:  faker.location.zipCode(),
        email:       faker.internet.email(),
        // Password policy: ≥8 chars, upper + lower + digit + special symbol
        password:    faker.string.alpha({ length: 3, casing: 'upper' })   // uppercase letters
                     + faker.string.alpha({ length: 3, casing: 'lower' }) // lowercase letters
                     + faker.string.numeric(3)                             // digits (≥1 number)
                     + faker.helpers.arrayElement(['!', '@', '#', '$'])   // special symbol
    };

    test.beforeEach(async ({ page }) => {
        poManager = new POManager(page);
        registrationPage = poManager.getRegistrationPage();
        await registrationPage.goto();
    });

    /**UI TC001 - Verify successful user registration with valid details */
    test('Verify successful user registration with valid details @sanity @regression', async ({ page }) => {
        await utils.addTestAnnotationsByKeyword("registration");
        await registrationPage.fillRegistrationForm(userData);
        await registrationPage.submitRegistrationForm();
        await registrationPage.verifyRegistrationSuccess();
        console.log('UI TC001 Passed');
    });
});
