const { test, expect } = require("@playwright/test");
require("dotenv").config();
const loggerUtilities = require("../../commonUtils/loggerUtil");
class loginPage {
  constructor(page) {
    this.page = page;
    this.log = new loggerUtilities();

    // Prism locators
    this.username = page.locator("input[name='email']")
    this.password = page.locator("#Password")
    this.loginbtn = page.locator(".loginButton")
    this.notification = page.locator(".Toastify__toast-body")
    this.notification_message = page.locator(".message")
    this.toastmessage = page.locator(".message");
    this.error = page.locator(".error");

    // Toolshop locators
    this.toolshopEmail         = page.locator('[data-test="email"]');
    this.toolshopPassword      = page.locator('[data-test="password"]');
    this.toolshopLoginBtn      = page.locator('[data-test="login-submit"]');
    this.toolshopUserMenu      = page.locator('[data-test="nav-menu"]');
    this.toolshopEmailError    = page.locator('[data-test="email-error"]');
    this.toolshopPasswordError = page.locator('[data-test="password-error"]');
    this.toolshopLoginError    = page.locator('[data-test="login-error"]');
  }

  async goto() {
    await this.page.goto(process.env.BASE_URL);
    this.log.logger("Successfully launched the Application");    
  }

  async loginUser(page, username, password) {
    await this.username.click();
    await this.username.fill(username)
    await this.password.click();
    await this.password.fill(password);
    await this.loginbtn.click();
    this.log.logger("Login Successful");
    await page.context().storageState({ path: "./storeBrowserState.json" });
  }

  async verifyErrorwithInvalidEmail(username){
    await this.username.click();
    await this.username.fill(username);
    await expect(this.error).toContainText("Please enter a valid Email address.");
    this.log.logger("Verified email name is invalid ");
  }


  /*function for negative test case to verify incorrect details do not let user login*/
  async loginUser_Incorrectdetails(page, username, password) {
    await this.username.click();
    await this.username.fill(username)
    await this.password.click();
    await this.password.fill("Rsdfsfsd@123456");
    await this.loginbtn.click();
    expect(await this.notification).toBeVisible();
    await expect(this.notification_message).toContainText("The Password entered is incorrect.");
    this.log.logger("Incorrect Password Entered Verified");

  }

  /*function for negative test case to verify incorrect details do not let user login*/
  async verifyIncorrrectPass_Msg() {
    const actualerrormessage = await this.toastmessage.textContent();
    expect(actualerrormessage).toEqual("Account is either inactive or does not exist.");
    this.log.logger("Error Modal Verified Successfully");
  }

  /** Navigate to the Toolshop login page via the Sign In nav link */
  async gotoToolshop() {
    await this.page.goto(process.env.BASE_URL);
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('[data-test="nav-sign-in"]').click();
    await this.page.waitForURL('**/auth/login');
    await this.page.waitForLoadState('networkidle');
    this.log.logger("Navigated to Toolshop Login page");
  }

  /** Fill and submit the Toolshop login form with the provided credentials */
  async loginToolshopUser(username, password) {
    await this.toolshopEmail.fill(username);
    await this.toolshopPassword.fill(password);
    await this.toolshopLoginBtn.click();
    this.log.logger("Submitted Toolshop login form for: " + username);
  }

  /** Verify successful Toolshop login — URL leaves /auth/login and the user menu is visible */
  async verifyToolshopLoginSuccess() {
    await this.page.waitForURL('**/account');
    await expect(this.toolshopUserMenu).toBeVisible();
    this.log.logger("Toolshop login verified — user menu visible on account page");
  }

  /** Submit the Toolshop login form without entering credentials */
  async submitToolshopLoginForm() {
    await this.toolshopLoginBtn.click();
    this.log.logger("Submitted Toolshop login form");
  }

  /** Verify mandatory-field validation errors and that login remains blocked */
  async verifyToolshopMandatoryFieldErrors(expectedEmailError, expectedPasswordError) {
    await expect(this.toolshopEmailError).toBeVisible();
    await expect(this.toolshopEmailError).toHaveText(expectedEmailError);
    await expect(this.toolshopPasswordError).toBeVisible();
    await expect(this.toolshopPasswordError).toHaveText(expectedPasswordError);
    await expect(this.page).toHaveURL(/.*auth\/login.*/);
    this.log.logger("Mandatory field validation errors verified — login blocked");
  }

  /** Verify the global login error shown for invalid credentials */
  async verifyToolshopInvalidLoginError(expectedMessage) {
    await expect(this.toolshopLoginError).toBeVisible();
    await expect(this.toolshopLoginError).toHaveText(expectedMessage);
    await expect(this.page).toHaveURL(/.*auth\/login.*/);
    await expect(this.toolshopUserMenu).not.toBeVisible();
    this.log.logger("Invalid credentials error verified — login blocked");
  }

}
module.exports = { loginPage };
