
const { defineConfig } = require('cypress');
module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  Scripts: {
    test:"npx cypress run",
    testChrome : "npx cypress run --spec cypress/integration/tests/test.js --browser chrome"
  },
  defaultCommandTimeout: 8000,
  experimentalSessionAndOrigin: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    specPattern: 'cypress/integration/tests/test.js'
  },
});