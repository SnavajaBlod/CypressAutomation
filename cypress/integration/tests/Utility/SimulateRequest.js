import baseClass from '../baseClass'
describe('Simulate Request', function () {
    const base = new baseClass()
    const orderTypes = base.convertToArray(Cypress.env("ORDER_TYPE"))
    const creditTypes = base.convertToArray(Cypress.env("CREDIT_TYPE"))
    const prefBloodbanks = base.convertToArray(Cypress.env("PREFERRED_BLOODBANK"))
    const appLink = Cypress.env("APP_DEPLOYMENT")
    const admin = Cypress.env("ADMIN_EMAIL")
    const driverAppLink = Cypress.env("DRIVER_DEPLOYMENT")
    const hub = Cypress.env("HUB")
    const driver = Cypress.env("DRIVER")
    const status = Cypress.env("STATUS")
    const iteration = Cypress.env("ITERATION")
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
                let i = 0
                while (i < iteration) {
                    it(`[${orderType}] [${creditType}] [Preferred Bloodbank-${prefBloodbank}] [Till: ${status}] `, function () {
                        if (orderType != 'Reservation' && ['Reserved', 'ReservationApproved', 'AgentAtBloodbank'].includes(status))
                            assert.fail("State not present for the selected order type")
                        let orderData = base.setOrderData(this.data, orderType, creditType, prefBloodbank)
                        cy.loginToApplication(orderData.hospitalData.email)
                        cy.importPages().then(pages => {
                            pages.raiseRequest.placeOrder(orderData).then(data => {
                                orderData = data
                                if (status == 'RequestRaised')
                                    return
                                cy.logoutOfApplication();
                                cy.loginToApplication(admin);
                                pages.driverMapping.mapDriver(orderData.requestId, orderData.bloodbankData.name, driver, hub)
                                if (status == 'BloodbankAccepted')
                                    return
                                cy.visit(driverAppLink)
                                cy.loginToDriverApp(driver)
                                cy.agentArrived(orderData.requestId + "-a")
                                if (status == 'AgentArrived')
                                    return
                                cy.sampleAcquired(orderData.requestId + "-a", orderData.hospitalData.creditType)
                                if (status == 'SampleAcquired')
                                    return
                                cy.crossMatching(orderData.requestId + "-a")
                                if (status == 'CrossMatching')
                                    return
                                if (orderData.orderType == 'Reservation') {
                                    cy.reserved(orderData.requestId + "-a")
                                    if (status == 'Reserved')
                                        return
                                    cy.visit(appLink)
                                    cy.logoutOfApplication();
                                    cy.loginToApplication(orderData.hospitalData.email)
                                    pages.hPendingActions.approveReservation('2')
                                    if (status == 'ReservationApproved')
                                        return
                                    cy.visit(driverAppLink)
                                    cy.loginToDriverApp(driver)
                                    cy.agentAtBloodbank(orderData.requestId + "-a")
                                    if (status == 'AgentAtBloodbank')
                                        return
                                }
                                cy.issued(orderData.requestId + "-a")
                                if (status == 'Issued')
                                    return
                                cy.delivered(orderData.requestId + "-a", orderData.hospitalData.creditType, orderData.orderType)
                                if (status == 'Delivered')
                                    return
                                cy.visit(appLink)
                                cy.logoutOfApplication();
                                cy.loginToApplication(admin)
                                pages.liveOrders.approveInvoice(orderData.requestId)
                            })
                        })
                    })
                    i++
                }
            })

        })
    })
})



