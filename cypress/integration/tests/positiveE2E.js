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
                    let orderData,expInvoice,expOrderSummary
                    cy.loginToApplication(admin);
                    cy.importPages().then(pages => {
                        base.setInitialData(this.data, pages, orderType, creditType, prefBloodbank).then((data) => {
                            return orderData = base.getInvoiceValues(data)
                        }).then(() => {
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
                            pages.liveOrders.validatePresenceOfDocs(orderData.requestId)
                            pages.liveOrders.viewDetailsPaymentInfo(orderData.requestId).then(values => {
                                cy.then(() => {
                                    Object.keys(values).forEach(key => {
                                        assert.equal(values[key], orderData.paymentDetails[key])
                                    })
                                })
                            }) 
                            pages.liveOrders.downloadDocuments(orderData.requestId)
                            expInvoice=base.expectedInvoice(orderData)
                        //    expOrderSummary=base.expectedOrderSummary(orderData)
                            base.convertPdfToText('C:\\Users\\VC\\Downloads\\'+orderData.requestId+'-a-hospital-'+orderData.hospitalData.name+'-invoice.pdf').then((actInvoice)=>{
                                expInvoice.forEach(exp=>{
                                    expect(actInvoice).to.include(exp)
                                })
                            })
                       /*     base.convertPdfToText('C:\\Users\\VC\\Downloads\\'+orderData.requestId+'-a-hospital-'+orderData.hospitalData.name+'-invoice.pdf').then((actOrderSummary)=>{
                                expOrderSummary.forEach(exp=>{
                                    expect(actOrderSummary).to.include(exp)
                                })
                            })*/
                            //verify sample acquired amount

                            // pages.orderImages.sampleAcquired(orderData.requestId,orderData.hospitalData.creditType)
                            // pages.orderImages.crossMatching(orderData.requestId)
                            // pages.orderImages.issued(orderData.requestId)
                            // pages.orderImages.delivered(orderData.requestId,orderData.hospitalData.creditType,orderData.orderType)
                        })
                    })

                })
                /*  
                         
 
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





