

import baseClass from '../tests/baseClass'

describe('Flat Package - E2E Positive Cases', function () {
    const base = new baseClass()
    const orderTypes = base.convertToArray(Cypress.env("ORDER_TYPE"))
    const creditTypes = base.convertToArray(Cypress.env("CREDIT_TYPE"))
    const prefBloodbanks = base.convertToArray(Cypress.env("PREFERRED_BLOODBANK"))
    const appLink = Cypress.env("APP_DEPLOYMENT")
    const admin = Cypress.env("ADMIN_EMAIL")
    const driverAppLink = Cypress.env("DRIVER_DEPLOYMENT")
    const hub = Cypress.env("HUB")
    const driver = Cypress.env("DRIVER")
    beforeEach(function () {
        cy.visit(appLink)
        cy.clearCookies();
        cy.clearLocalStorage();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
        cy.fixture('example').then(function (data) {
            this.data = data;
        })
    })
    orderTypes.forEach(orderType => {
        creditTypes.forEach(creditType => {
            prefBloodbanks.forEach(prefBloodbank => {
                it('should upload an image file successfully', () => {
                    // Visit the page where the file upload is located
                    cy.loginToApplication(admin);
                    cy.get('#orderimages').click()
                    cy.get('input').type('2d99ec10')
                    cy.get('button').contains('Search').click()
                
                    // Find the file input element
                    cy.get('input[type="file"]').then((fileInput) => {
                      // Load the image file from fixtures
                      cy.fixture('8.png', 'base64').then(fileContent => {
                        const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png');
                        const file = new File([blob], 'example-image.png', { type: 'image/png' });
                
                        // Create a DataTransfer object and add the file to it
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        fileInput[0].files = dataTransfer.files;
                
                        // Trigger the change event on the file input
                        cy.wrap(fileInput).trigger('change', { force: true });
                      });
                    });
                
                    // Optionally, submit the form if necessary
                    cy.get('form').submit();
                
                    // Add assertions to verify the upload success
                    cy.get('.upload-success-message').should('be.visible');
                  });
            })
        })
    })
})


