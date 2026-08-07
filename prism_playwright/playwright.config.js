// @ts-check
const { defineConfig } = require("@playwright/test");
require('dotenv').config();

module.exports = defineConfig({
  testDir: "./tests",
  retries: 0,
  workers: 2,
  //fullyParallel: true,
  /* Maximum time one test can run for. */
  timeout: 250 * 1000,
  expect: {
    timeout: 60000,
  },
  reporter: [
    ['html'],
    ['allure-playwright', {
      detail: false,
      suiteTitle: false,
    }]
  ],
  //   ['html', { outputFolder: "./test-results" }],],
  projects: [
    // {
    //   name: "API",
    //   testMatch: "**/hooks.js",
    //   use: {
    //     browserName: "chromium",
    //     headless: false,
    //     screenshot: "on",
    //     // video: {
    //     //   mode: "on",
    //     //   size: { width: 1200, height: 880 },
    //     // },
    //     //video: 'retain-on-failure',
    //     ignoreHttpsErrors: true,
    //     permissions: ["geolocation"],
    //     viewport: { width: 1300, height: 900 },
    //     trace: "on",
    //     launchOptions: {
    //       slowMo: 600,
    //     },
    //   },

    // },
    {
      name: "testcases_regression",
      testMatch: "**/*.spec.js",
      use: {
        browserName: "chromium",
        headless: false,
        screenshot: "only-on-failure",
        video: "off",
        trace: "off",
        ignoreHttpsErrors: true,
        permissions: ["geolocation"],
        viewport: { width: 1600, height: 1200 },
        launchOptions: {
          slowMo: 800,
        },
      },
    },
  ],
});
