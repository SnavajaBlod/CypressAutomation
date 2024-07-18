import loginPage from "../pageObjects/Common/loginPage"
import raiseRequest from "../pageObjects/Hospital/raiseRequest"
import driverMapping from "../pageObjects/Admin/driverMapping"
import liveOrders from "../pageObjects/Admin/liveOrders"

describe('First Test', function () {
    beforeEach(function () {
        cy.visit("https://dev.blodplus.com/")
        cy.clearCookies();
        cy.clearLocalStorage();
        indexedDB.deleteDatabase('firebaseLocalStorageDb');
        cy.fixture('example').then(function (data) {
            this.data = data
        })
    })
    it('Test Case', function () {

        const obj = new loginPage()
        const obj2 = new raiseRequest
        const obj3 = new driverMapping
        const obj4 = new liveOrders
    cy.log('1')
        cy.loginToApplication("brown@gmail.com")
       cy.get('#raiserequest').click()
        obj2.placeOrder().then(requestId => {
            // requestId is now available here
            console.log('2')
            obj.logoutOfApplication();
            // Login again with a different user
            cy.loginToApplication("bloodsupport@blod.in");

            // Click on a button to initiate mapping
            cy.get('button').contains('Link').click();
            console.log('3')
            // Map driver with requestId
            obj3.mapDriver(requestId)
            cy.get('span').contains('Dashboard').click()
            cy.get('#liveorders').click()
            cy.wait(8000)
           obj4.viewDetails().then(values => {
                console.log('4')
                cy.then(() => {
                    cy.log('Total:', values.total);
                    cy.log('Due:', values.due);
                    cy.log('Credit:', values.credit);
                    cy.log('Paid:', values.paid);
                });
                console.log('5')
                cy.visit("https://blodplus-driver-git-develop-blod-in-team.vercel.app")
                cy.loginToDriverApp().then(() => {
                    cy.agentArrived(requestId + "-a")
                    cy.sampleAcquired(requestId + "-a")
                    cy.crossMatching(requestId + "-a")
                    cy.issued(requestId + "-a")
                    cy.delivered(requestId + "-a")
                })
                console.log('6')
                 cy.visit("https://dev.blodplus.com/")
                 cy.get('#liveorders').click()
                 obj4.approveInvoice()
                 console.log('7')

            })
        })
    })
    it('Test Case 2', function () {
        cy.log('1')
        cy.loginToApplication("b@gmail.com")
       cy.get('#raiserequest').click()
    })
   
})