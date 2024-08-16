// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import 'cypress-mochawesome-reporter/register';

// Alternatively you can use CommonJS syntax:
// require('./commands')
Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false
  })

  const defaults = require('../config/defaults');
  function setDefaultEnvVars(defaults) {
    Object.keys(defaults).forEach(key => {
      const defaultValue = defaults[key];
      const existingValue = Cypress.env(key);
      if (Array.isArray(defaultValue)) {
        // If the default value is an array, set it only if the environment variable is not already set
        if (!existingValue) {
          Cypress.env(key, defaultValue);
        }
      } else {
        // For non-array values (strings, numbers, etc.), set it only if the environment variable is not already set
        Cypress.env(key, existingValue || defaultValue);
      }
    });
  }
  setDefaultEnvVars(defaults);