

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
                it(`[${orderType} Order] [${creditType}] [Preferred Bloodbank-${prefBloodbank}] `, function () {
                    let orderData, expInvoice, expOrderSummary
                    cy.loginToApplication(admin);

                    cy.importPages().then(pages => {
                        base.setInitialData(this.data, pages, orderType, creditType, prefBloodbank).then((data) => {
                            orderData = base.getInvoiceValues(data)
                        })
                            .then(() => {
                                cy.logoutOfApplication()
                                cy.loginToApplication(orderData.hospitalData.email)
                                return pages.raiseRequest.placeOrder(orderData)
                            }).then((data) => {
                                orderData = data
                                cy.logoutOfApplication();
                                cy.loginToApplication(admin);
                                return pages.driverMapping.mapDriver(orderData.requestId, orderData.bloodbankData.name, driver, hub)
                            }).then(() => {
                                pages.orderImages.agentArrived(orderData.requestId)
                                cy.visit(driverAppLink)
                                cy.loginToDriverApp(driver)


                                cy.sampleAcquired(orderData.requestId + "-a", orderData.hospitalData.creditType)


                            })

                    })
                });
            })
        })
    })
})


