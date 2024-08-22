
const { defineConfig } = require('cypress');
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');
module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  defaultCommandTimeout: 10000,
  experimentalSessionAndOrigin: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task', {
        readPdf(pdfPath) {
          return new Promise((resolve) => {
            const filePath = path.resolve(pdfPath)
            const dataBuffer = fs.readFileSync(filePath)
            pdf(dataBuffer).then((data) => {
              resolve(data)
            })
          })

        }
      })
    },
    specPattern: 'cypress/integration/tests/**/*',
  }
});