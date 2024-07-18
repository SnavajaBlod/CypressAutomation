// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import loginPage from "C:/Users/VC/CypressAutomationLocal/cypress/integration/pageObjects/Common/loginPage"

Cypress.Commands.add('getLoginPage', () => {
    return new loginPage();
})

Cypress.Commands.add('loginToApplication', (email) => {
    cy.get('[type="text"]').type(email)
    cy.get('[type="password"]').type("blodadmin")
    cy.get('button').contains('Login').click()
})

Cypress.Commands.add('loginToDriverApp', () => {
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.clearCookies();
        cy.clearLocalStorage();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
      //  cy.visit('https://blodplus-driver-git-develop-blod-in-team.vercel.app')
        cy.get('input[type="text"]').type("ayush@blod.in")
        cy.get('[type="password"]').type("blodadmin")
        cy.get('#loginButton').click()
        cy.wait(5000)
    })
})
Cypress.Commands.add('openRequestPage', (requestId) => {
    const req = { reqId: requestId }
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', { args: { req } }, ({ req }) => {
        const { reqId } = req
        cy.get('h1').contains('Welcome back!', { timeout: 20000 })
        cy.get('tbody tr').each($el => {
            let n = $el.find('td:nth-child(1)').text()
            if (n === (reqId)) {
                cy.wrap($el).find('#viewOrder').click()
                return false
            }
        })
    })
})
Cypress.Commands.add('agentArrived', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 15000 }).click()
        cy.get('#uploadButton').click()
    })
})
Cypress.Commands.add('sampleAcquired', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 15000 }).click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#uploadButton').click()
    })
})
Cypress.Commands.add('crossMatching', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 15000 }).click()
        cy.get('#uploadButton').click()
    })
})
Cypress.Commands.add('issued', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 15000 }).click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#uploadButton').click()
    })
})
Cypress.Commands.add('delivered', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 15000 }).click()
        cy.get('#uploadButton').click()
    })
})