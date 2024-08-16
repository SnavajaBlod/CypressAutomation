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
                    let orderData = base.setOrderData(this.data, orderType, creditType, prefBloodbank)
                    cy.loginToApplication(admin);

                   cy.importPages().then(pages => {
                    pages.liveOrders.approveInvoice('abdcbf00')
                           /* pages.bloodbankPrices.getBloodbankPrices(orderData).then(data=>
                            {  cy.then(() => {
                                orderData=data
                            }).then(()=>{
                                cy.log(orderData.bloodbankData.reservationCharge)
                                cy.log(orderData.bloodbankData.componentCharge)
                                cy.log(orderData.bloodbankData.name)
                                for (const [key, value] of Object.entries(orderData)) {
                                    cy.log(`${key}: ${value}`);
                                }
                            })
                            
                           
                            })*/
                        })
                    })
                })
            })
        })
    })


