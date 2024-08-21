import baseClass from '../tests/baseClass'
describe('Flat Package - E2E Positive Cases', function () {
    const base = new baseClass()
    const orderTypes = base.convertToArray(Cypress.env("ORDER_TYPE"))
    const creditTypes = base.convertToArray(Cypress.env("CREDIT_TYPE"))
    const prefBloodbanks = base.convertToArray(Cypress.env("PREFERRED_BLOODBANK"))
    const appLink = Cypress.env("APP_DEPLOYMENT")
    const admin = Cypress.env("ADMIN_EMAIL")
    const driverAppLink = Cypress.env("DRIVER_DEPLOYMENT")
    const bloodbank = Cypress.env("BLOODBANK")
    const hub = Cypress.env("HUB")
    const driver = Cypress.env("DRIVER")
    let dist
    beforeEach(function () {
        
        cy.visit(appLink)
        cy.clearCookies();
        cy.clearLocalStorage();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
   
    })
    orderTypes.forEach(orderType => {
        creditTypes.forEach(creditType => {
            prefBloodbanks.forEach(prefBloodbank => {
                it(`[${orderType} Order] [${creditType}] [Preferred Bloodbank-${prefBloodbank}] `, function () {
                    let hospital = base.getHospital(creditType, prefBloodbank)
                    
                    cy.getDistances('asd','fdsa').then(()=>
                        {
                        dist=Cypress.env('DISTANCE')
                        })
              cy.log(dist)
                    cy.loginToApplication(hospital.email)
                    cy.importPages().then(pages => {
                        pages.raiseRequest.placeOrder(orderType).then(requestId => {
                            cy.logoutOfApplication();
                            cy.log(admin)
                            cy.loginToApplication(admin);
                            pages.driverMapping.mapDriver(requestId)
                            cy.request('GET', 'https://dev.blodplus.com/api/getDistance?source=Anna%20Nagar%2C%20Chennai%2C%20Tamil%20Nadu%2C%20India&destination=V.H.S%20blood%20Bank%2C%20Pallipattu%2C%20Tharamani%2C%20Chennai%2C%20Tamil%20Nadu%2C%20India&type=api&token=blodadmin').then(function(response){
                                cy.log(response.body)
                            })
                            
                            cy.window().then((win) => {
                                // Store original console.log
                                const originalConsoleLog = win.console.log;
                                cy.log(originalConsoleLog)
                            })
                            pages.liveOrders.viewDetailsPaymentInfo().then(values => {
                                cy.then(() => {
                                    cy.log('Total:', values.total);
                                    cy.log('Due:', values.due);
                                    cy.log('Credit:', values.credit);
                                    cy.log('Paid:', values.paid);
                                });
                                cy.visit(driverAppLink)
                                cy.loginToDriverApp().then(() => {
                                    cy.agentArrived(requestId + "-a")
                                    cy.sampleAcquired(requestId + "-a")
                                    cy.crossMatching(requestId + "-a")
                                    cy.issued(requestId + "-a")
                                    cy.delivered(requestId + "-a")
                                })
                                cy.visit(appLink)
                                pages.liveOrders.approveInvoice()
                            })
                        })
                    })
                })
            })
        })
    })
})

