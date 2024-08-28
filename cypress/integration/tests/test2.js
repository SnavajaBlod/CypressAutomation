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
                    let scheme = 'Blood Flat Package'
                    cy.loginToApplication(admin);
                    cy.importPages().then(pages => {
                        base.setInitialData(this.data, pages, orderType, creditType, prefBloodbank).then((data) => {
                            orderData = base.getInvoiceValues(data)
                            return orderData = base.assignCredits(data)
                        }).then(() => { //change scheme
                            return pages.hospitalPrices.changePricingScheme(orderData.hospitalData.name, scheme)
                        }).then(() => { //raise request
                            cy.logoutOfApplication()
                            cy.loginToApplication(orderData.hospitalData.email)
                            return pages.raiseRequest.placeOrder(orderData)
                        }).then((data) => { //map driver
                            orderData = data
                            cy.logoutOfApplication();
                            cy.loginToApplication(admin);
                            return pages.driverMapping.mapDriver(orderData.requestId, orderData.bloodbankData.name, driver, hub)
                        }).then(() => { //agent arrived
                            return pages.orderImages.agentArrived(orderData.requestId + "-a")
                        }).then(() => { //presence of docs
                            return pages.liveOrders.validatePresenceOfDocs(orderData.requestId)
                        }).then(() => { //verify view details
                            return pages.liveOrders.viewDetailsPaymentInfo(orderData.requestId).then(values => {
                                cy.then(() => {
                                    Object.keys(values).forEach(key => {
                                        cy.log('actual:' + values[key] + ", expected:" + orderData.paymentDetails[key])
                                        assert.equal(values[key], orderData.paymentDetails[key])
                                    })
                                })
                            })
                        }).then(() => { //verify docs
                            pages.liveOrders.downloadDocuments(orderData.requestId)
                            expInvoice = base.expectedInvoice(orderData)
                            expOrderSummary = base.expectedOrderSummary(orderData)
                            cy.wait(3000)
                            base.convertPdfToText('C:\\Users\\VC\\CypressAutomationLocal\\cypress\\downloads\\' + orderData.requestId + '-a-hospital-' + orderData.hospitalData.name + '-invoice.pdf').then((actInvoice) => {
                                expInvoice.forEach(exp => {
                                    expect(actInvoice).to.include(exp)
                                })
                            })
                            base.convertPdfToText('C:\\Users\\VC\\CypressAutomationLocal\\cypress\\downloads\\' + orderData.requestId + '-a-orderSummary.pdf').then((actOrderSummary) => {
                                expOrderSummary.forEach(exp => {
                                    expect(actOrderSummary).to.include(exp)
                                })
                            })
                        }).then(() => { //sample acquired
                            return pages.orderImages.sampleAcquired(orderData.requestId + "-a", orderData.hospitalData.creditType).then(() => {
                                if (orderData.hospitalData.creditType !== 'FullCredit') {
                                    // assert.equal(amount, orderData.paymentDetails.Due)
                                    orderData.paymentDetails.Paid = orderData.paymentDetails.Due
                                    orderData.paymentDetails.Due = 'N/A'

                                }
                            })



                        }).then(() => { //verify view details   

                            return pages.liveOrders.viewDetailsPaymentInfo(orderData.requestId).then(values => {


                                cy.then(() => {

                                    Object.keys(values).forEach(key => {

                                        cy.log('actual:' + values[key] + ", expected:" + orderData.paymentDetails[key]).then(() => {
                                            assert.equal(values[key], orderData.paymentDetails[key])
                                        })
                                    })
                                })
                            })
                        }).then(() => {//cross matching
                            pages.orderImages.crossMatching(orderData.requestId + "-a")
                        }).then(() => {
                            if (orderData.orderType == 'Reservation') {
                                pages.orderImages.reserved(orderData.requestId + "-a")
                                cy.visit(appLink).then(() => {
                                    pages.liveOrders.approveReservation(orderData.requestId, '2').then(() => {
                                        orderData.orderStatus = 'Reservation Approved'
                                        orderData = base.getInvoiceValues(orderData)
                                        if (orderData.hospitalData.creditType === 'FullCredit') {
                                            orderData.paymentDetails.Total = Math.ceil(orderData.invoiceDetails.totalAmount)
                                            orderData.paymentDetails.Credit = orderData.paymentDetails.Total
                                        }
                                        else if (orderData.hospitalData.creditType === 'NoCredit') {
                                            orderData.paymentDetails.Due = Math.ceil(orderData.invoiceDetails.totalAmount - Number(orderData.paymentDetails.Paid))
                                            orderData.paymentDetails.Total = Math.ceil(orderData.invoiceDetails.totalAmount)
                                        }
                                        else if (orderData.hospitalData.creditType === 'BlodCredit') {
                                            orderData.paymentDetails.Credit = Math.ceil(orderData.invoiceDetails.blodTotal)
                                            orderData.paymentDetails.Due = Math.ceil(orderData.invoiceDetails.bloodbankTotal - Number(orderData.paymentDetails.Paid))
                                            orderData.paymentDetails.Total = Math.ceil(orderData.invoiceDetails.totalAmount)
                                        }
                                    })
                                    pages.orderImages.agentAtBloodbank(orderData.requestId + "-a")
                                    pages.liveOrders.viewDetailsPaymentInfo(orderData.requestId).then(values => {
                                        cy.then(() => {
                                            Object.keys(values).forEach(key => {
                                                cy.log('actual:' + values[key] + ", expected:" + orderData.paymentDetails[key])
                                                assert.equal(values[key], orderData.paymentDetails[key])
                                            })
                                        })
                                    })
                                 /*   pages.liveOrders.downloadDocuments(orderData.requestId)
                                    expInvoice = base.expectedInvoice(orderData)
                                    expOrderSummary = base.expectedOrderSummary(orderData)
                                    cy.wait(3000)
                                    base.convertPdfToText('C:\\Users\\VC\\CypressAutomationLocal\\cypress\\downloads\\' + orderData.requestId + '-a-hospital-' + orderData.hospitalData.name + '-invoice.pdf').then((actInvoice) => {
                                        expInvoice.forEach(exp => {
                                            expect(actInvoice).to.include(exp)
                                        })
                                    })
                                    base.convertPdfToText('C:\\Users\\VC\\CypressAutomationLocal\\cypress\\downloads\\' + orderData.requestId + '-a-orderSummary.pdf').then((actOrderSummary) => {
                                        expOrderSummary.forEach(exp => {
                                            expect(actOrderSummary).to.include(exp)
                                        })
                                    })*/
                                })
                                //    cy.logoutOfApplication();
                                //   cy.loginToApplication(orderData.hospitalData.email)
                                //  pages.hPendingActions.approveReservation('2')
                            }
                        }).then(() => {
                            pages.orderImages.issued(orderData.requestId + "-a")
                            pages.orderImages.delivered(orderData.requestId + "-a", orderData.hospitalData.creditType, orderData.orderType).then(()=>{
                                if (orderData.hospitalData.creditType !== 'FullCredit' && orderData.orderType === 'Reservation') {
                                    //     assert.equal(amount, orderData.paymentDetails.Due)
                                    if (orderData.hospitalData.creditType !== 'NoCredit')
                                        orderData.paymentDetails.Paid = orderData.paymentDetails.Total
                                    if (orderData.hospitalData.creditType !== 'BlodCredit')
                                        orderData.paymentDetails.Paid = Math.ceil(orderData.invoiceDetails.bloodbankTotal)
                                    orderData.paymentDetails.Due = 'N/A'
                                }
                            })

                           


                        }).then(() => {
                            pages.liveOrders.viewDetailsPaymentInfo(orderData.requestId).then(values => {
                                cy.then(() => {
                                    Object.keys(values).forEach(key => {
                                        cy.log('actual:' + values[key] + ", expected:" + orderData.paymentDetails[key])
                                        assert.equal(values[key], orderData.paymentDetails[key])
                                    })
                                })
                            })
                            pages.liveOrders.approveInvoice(orderData.requestId)

                        })
                    })
                })
            })
        })
    })

})





