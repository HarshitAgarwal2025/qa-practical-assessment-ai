const { faker } = require('@faker-js/faker/locale/en');
const { POManager } = require('../pageobjects/POManager');
const registrationData = require('../resources/data/registrationData.json');

/**
 * Builds a unique Toolshop user for registration.
 * Static address/contact fields come from registrationData.json;
 * name, address variety, email and password are faker-generated.
 */
function generateToolshopUser() {
    return {
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
        password:    faker.string.alpha({ length: 3, casing: 'upper' })
                     + faker.string.alpha({ length: 3, casing: 'lower' })
                     + faker.string.numeric(3)
                     + faker.helpers.arrayElement(['!', '@', '#', '$'])
    };
}

/**
 * Registers a new Toolshop user and returns the user data (including email/password).
 * Leaves the browser on the login page after successful registration.
 */
async function registerToolshopUser(page, userData = null) {
    const user = userData || generateToolshopUser();
    const registrationPage = new POManager(page).getRegistrationPage();

    await registrationPage.goto();
    await registrationPage.fillRegistrationForm(user);
    await registrationPage.submitRegistrationForm();
    await registrationPage.verifyRegistrationSuccess();

    return user;
}

module.exports = { generateToolshopUser, registerToolshopUser };
