export default class driverMapping {
    //element locators
    requestIdInput() {
        return cy.get('input[placeholder="Enter the Request ID"]')
    }
    goButton() {
        return cy.get('button').contains('Go')
    }
    selectBloodbank() {
        return cy.get('label:contains("Select Blood Bank") + div > div > div > div > input')
    }
    selectDriver() {
        return cy.get('label:contains("Select Delivery Driver") + div > div > div > div > input')
    }
    selectHub() {
        return cy.get('label:contains("Select Hub") + div > div > div > div > input')
    }
    submitButton() {
        return cy.get('button').contains('SUBMIT')
    }
    //page functions
    mapDriver(requestId,bloodbank,driver,hub) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('button').contains('Link').click();
        })
        return new Cypress.Promise((resolve, reject) => {
            this.requestIdInput().type(requestId)
            this.goButton().click()
            this.selectBloodbank().type(bloodbank).type('{enter}')
            this.selectHub().type(hub).type('{enter}')
            this.selectDriver().type(driver).type('{enter}')
            this.submitButton().click()
            cy.get('.swal-button--confirm').click()
            resolve()
        })

    }
}
