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
                    let orderData
                    cy.loginToApplication(admin);
                    cy.importPages().then(pages => {
                        base.setInitialData(this.data, pages, orderType, creditType, prefBloodbank).then((data) => {
                            orderData = base.getInvoiceValues(data)
                            base.pdfFunction()
                        })
                    })
                    // cy.logoutOfApplication();
                    //cy.loginToApplication(orderData.hospitalData.email)
                    // pages.raiseRequest.placeOrder(orderData).then(data => {
                    //    return orderData = data
                    //})
                })
                /*   cy.loginToApplication(orderData.hospitalData.email)
                   cy.importPages().then(pages => {
                       pages.raiseRequest.placeOrder(orderData).then(data => {
                           return orderData = data
                       }).then(() => { //map driver, get bloodbank details
                           cy.logoutOfApplication();
                           cy.loginToApplication(admin);
                           pages.driverMapping.mapDriver(orderData.requestId, orderData.bloodbankData.name, driver, hub)
                           return pages.bloodbankPrices.getBloodbankPrices(orderData).then((data) => {
                               orderData = data
                           })
                       }).then(() => { //get bloodbank address
                           //get bloodbank address
                           //get hospital address
                           //get hospital details
                          
                       })
 
                         pages.liveOrders.viewDetailsPaymentInfo(orderData.requestId).then(values => {
                             cy.then(() => {
                                 cy.log('Total:', values.total);
                                 cy.log('Due:', values.due);
                                 cy.log('Credit:', values.credit);
                                 cy.log('Paid:', values.paid);
                             })
                         })
                         cy.visit(driverAppLink)
                         cy.loginToDriverApp(driver)
                         cy.agentArrived(orderData.requestId + "-a")
                         cy.sampleAcquired(orderData.requestId + "-a", orderData.hospitalData.creditType)
                         cy.crossMatching(orderData.requestId + "-a")
                         if (orderData.orderType == 'Reservation') {
                             cy.reserved(orderData.requestId + "-a")
                             cy.visit(appLink)
                             cy.logoutOfApplication();
                             cy.loginToApplication(orderData.hospitalData.email)
                             pages.hPendingActions.approveReservation('2')
                             cy.visit(driverAppLink)
                             cy.loginToDriverApp(driver)
                             cy.agentAtBloodbank(orderData.requestId + "-a")
                         }
                         cy.issued(orderData.requestId + "-a")
                         cy.delivered(orderData.requestId + "-a", orderData.hospitalData.creditType, orderData.orderType)
                         cy.visit(appLink)
                         cy.logoutOfApplication();
                         cy.loginToApplication(admin)
                         pages.liveOrders.approveInvoice(orderData.requestId)*/
                //     })
            })
        })
    })
})





