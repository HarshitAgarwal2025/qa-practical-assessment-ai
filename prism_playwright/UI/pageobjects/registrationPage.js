const { expect } = require("@playwright/test");
const loggerUtilities = require("../../commonUtils/loggerUtil");

class registrationPage {
    /**
     * Page Object for the Toolshop Customer Registration page.
     * Locators are derived from the live application DOM (Aug 2026).
     *
     * Address auto-fill behaviour: selecting a country and entering a postal code
     * and house number triggers an API call that populates street, city and state
     * automatically. Those fields are still set explicitly after a short wait so the
     * form is valid regardless of whether the auto-fill succeeds.
     */
    constructor(page) {
        this.page = page;
        this.log  = new loggerUtilities();

        // Form wrapper
        this.registerForm     = page.locator('[data-test="register-form"]');

        // Personal details
        this.firstNameInput   = page.locator('[data-test="first-name"]');
        this.lastNameInput    = page.locator('[data-test="last-name"]');
        this.dobInput         = page.locator('[data-test="dob"]');
        this.phoneInput       = page.locator('[data-test="phone"]');

        // Address — country + postalCode + houseNumber trigger the auto-fill
        this.countrySelect    = page.locator('[data-test="country"]');
        this.postalCodeInput  = page.locator('[data-test="postal_code"]');
        this.houseNumberInput = page.locator('[data-test="house_number"]');
        this.streetInput      = page.locator('[data-test="street"]');
        this.cityInput        = page.locator('[data-test="city"]');
        this.stateInput       = page.locator('[data-test="state"]');

        // Account credentials
        this.emailInput       = page.locator('[data-test="email"]');
        this.passwordInput    = page.locator('[data-test="password"]');

        // Submit button
        this.registerBtn      = page.locator('[data-test="register-submit"]');
    }

    async goto() {
        await this.page.goto(process.env.BASE_URL);
        await this.page.waitForLoadState('networkidle');
        await this.page.locator('[data-test="nav-sign-in"]').click();
        await this.page.waitForURL('**/auth/login');
        await this.page.locator('[data-test="register-link"]').click();
        await this.page.waitForURL('**/auth/register');
        await this.page.waitForLoadState('networkidle');
        this.log.logger("Navigated to Customer Registration page via Sign In → Register your account");
    }

    /**
     * Fills every field on the registration form.
     *
     * Fill order:
     *   1. Personal info (firstName, lastName, dob)
     *   2. Address lookup triggers (country → postalCode → houseNumber)
     *   3. Wait 500 ms for the address auto-fill API call to settle
     *   4. Explicitly set street, city, state (overwrites auto-fill or fills if it failed)
     *   5. Contact & credentials (phone, email, password)
     *
     * @param {Object} userData - { firstName, lastName, dob,
     *                              country, postalCode, houseNumber,
     *                              street, city, state,
     *                              phone, email, password }
     */
    async fillRegistrationForm(userData) {
        await this.firstNameInput.fill(userData.firstName);
        await this.lastNameInput.fill(userData.lastName);
        await this.dobInput.fill(userData.dob);

        await this.countrySelect.selectOption(userData.country);
        await this.postalCodeInput.fill(userData.postalCode);
        await this.houseNumberInput.fill(userData.houseNumber);

        // Allow the address auto-fill API call to resolve before overriding
        await this.page.waitForTimeout(500);
        await this.streetInput.fill(userData.street);
        await this.cityInput.fill(userData.city);
        await this.stateInput.fill(userData.state);

        await this.phoneInput.fill(userData.phone);
        await this.emailInput.fill(userData.email);
        await this.passwordInput.fill(userData.password);
        await this.page.getByText('Password Your password must:').click();

        this.log.logger("Registration form filled for: " + userData.email);
    }

    /**
     * Submits the registration form.
     *
     * Two clicks are required on this Angular form:
     *   - First click marks all untouched fields as touched, triggering validators.
     *   - Second click submits once the form is in a valid + submitted state.
     */
    async submitRegistrationForm() {
        await this.registerBtn.scrollIntoViewIfNeeded();
        await this.registerBtn.click();
        await this.registerBtn.click();
        this.log.logger("Submitted registration form");
    }

    /**
     * Verifies successful registration by asserting the redirect to /auth/login.
     * The Toolshop application navigates to /auth/login on successful account creation.
     */
    async verifyRegistrationSuccess() {
        await expect(this.page).toHaveURL(/.*auth\/login.*/);
        this.log.logger("Registration successful — redirected to login page");
    }

    /**
     * Returns the trimmed text of a field's inline validation error element.
     * Each field exposes a dedicated data-test error node, e.g. [data-test="first-name-error"].
     *
     * @param {string} fieldName - The data-test field name prefix (e.g. "first-name", "email").
     * @returns {Promise<string>} The visible error text.
     */
    async getFieldError(fieldName) {
        const errorEl = this.page.locator(`[data-test="${fieldName}-error"]`);
        await expect(errorEl).toBeVisible();
        const text = await errorEl.textContent();
        this.log.logger(`Validation error for [${fieldName}]: ${text.trim()}`);
        return text.trim();
    }
}

module.exports = { registrationPage };
