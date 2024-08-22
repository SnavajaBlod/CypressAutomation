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
import raiseRequestPage from "../integration/pageObjects/Hospital/raiseRequest"
import driverMappingPage from "../integration/pageObjects/Admin/driverMapping"
import liveOrdersPage from "../integration/pageObjects/Admin/liveOrders"
import bloodbankPricesPage from "../integration/pageObjects/Admin/updateBloodbankPrices"
import hPendingActionsPage from "../integration/pageObjects/Hospital/pendingActions"
import bloodbankListPage from  "../integration/pageObjects/Admin/bloodbankList"
import hospitalListPage from "../integration/pageObjects/Admin/hospitalList"
import hospitalPricesPage from "../integration/pageObjects/Admin/updateHospitalPrices"
import orderImagesPage from "../integration/pageObjects/Admin/orderImages"

Cypress.Commands.add('importPages', () => {
    return {
        raiseRequest: new raiseRequestPage(),
        driverMapping: new driverMappingPage(),
        liveOrders: new liveOrdersPage(),
        hPendingActions: new hPendingActionsPage(),
        bloodbankPrices: new bloodbankPricesPage(),
        bloodbankList: new bloodbankListPage(),
        hospitalList: new hospitalListPage(),
        hospitalPrices: new hospitalPricesPage(),
        orderImages:new orderImagesPage()
    }
})
Cypress.Commands.add('loginToApplication', (email) => {
    cy.get('[placeholder="Enter your email address here"]').type(email)
    cy.get('[type="password"]').type("blodadmin")
    cy.get('button').contains('Login').click()
})
Cypress.Commands.add('logoutOfApplication', () => {
    cy.get('#nav-dropdown').click({ force: true })
    cy.get('button').contains('Log Out').click({ force: true })
    cy.get('button').contains('Yes').click({ force: true })
})
Cypress.Commands.add('loginToDriverApp', (driver) => {
    const d = { email: driver }
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', { args: { d } }, ({ d }) => {
        const { email } = d
        cy.clearCookies();
        cy.clearLocalStorage();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
        cy.get('input[type="text"]',{ timeout: 50000 }).type(email)
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
                cy.wrap($el).find('#viewOrder').click({force:true})
                return false
            }
        })
    })
})
Cypress.Commands.add('agentArrived', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 20000 }).click()
        cy.get('#uploadButton').click()
        cy.get('h1').contains('Welcome back!', { timeout: 20000 })
    })
})
Cypress.Commands.add('sampleAcquired', (requestId, creditType) => {
    cy.openRequestPage(requestId)
    if (creditType != 'FullCredit') {
        cy.collectPayment();
    }
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app',() => { 
        cy.get('#captureButton', { timeout: 20000 }).click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#uploadButton').click()
        cy.get('h1').contains('Welcome back!', { timeout: 20000 })
    })
})
Cypress.Commands.add('crossMatching', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 20000 }).click()
        cy.get('#uploadButton').click()
        cy.get('h1').contains('Welcome back!', { timeout: 20000 })
    })
})
Cypress.Commands.add('reserved', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 20000 }).click()
        cy.get('#uploadButton').click()
        cy.get('h1').contains('Welcome back!', { timeout: 20000 })
    })
})
Cypress.Commands.add('agentAtBloodbank', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 20000 }).click()
        cy.get('#uploadButton').click()
        cy.get('h1').contains('Welcome back!', { timeout: 20000 })
    })
})
Cypress.Commands.add('issued', (requestId) => {
    cy.openRequestPage(requestId)
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
        cy.get('#captureButton', { timeout: 20000 }).click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#nextButton').click()
        cy.get('#captureButton').click()
        cy.get('#uploadButton').click()
        cy.get('h1').contains('Welcome back!', { timeout: 40000 })
    })
})
Cypress.Commands.add('delivered', (requestId,creditType,orderType) => {
    cy.openRequestPage(requestId)
    if (creditType != 'FullCredit' && orderType=='Reservation')
        cy.collectPayment()
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {  
        cy.get('#captureButton', { timeout: 20000 }).click()
        cy.get('#uploadButton').click()
        cy.get('h1').contains('Welcome back!', { timeout: 20000 })
    })
})
Cypress.Commands.add('collectPayment', () => {
    cy.origin('https://blodplus-driver-git-develop-blod-in-team.vercel.app', () => {
    cy.get('#collectPaymentButton').click()
    cy.get('input[value="Cash"]').click()
    cy.get('#paymentButton').click()
    cy.get('.Toastify > div > div > div > div:nth-of-type(2)').contains('Payment Details Updated')
    })
})
Cypress.Commands.add('getDistances', (source, destination) => {
 //    source='Anna Nagar, Chennai, Tamil Nadu, India'
 //   destination='V.H.S blood Bank, Pallipattu, Tharamani, Chennai, Tamil Nadu, India'
    let apiUrl = `https://dev.blodplus.com/api/getDistance?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&type=api&token=blodadmin`;
     cy.request('POST', apiUrl).then(function (response) {
        console.log(response.body)
        return response.body.message.rows[0].elements[0].distance.text
    })
})

