export default class pendingActions {
    acceptButton() {
        return cy.get('tbody tr:nth-child(1) td:nth-child(7) div button:nth-child(1)')
    }
    enterUnits() {
        return cy.get('#noOfUnits div div input')
    }
    toastMessage() {
        return cy.get('.Toastify > div > div > div:nth-child(1) > div:nth-child(2)')
    }
    approveReservation(units) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#pendingrequests').click()
        })
        return new Cypress.Promise((resolve, reject) => {
            this.acceptButton().click()
            cy.log(units)
            if (units == '1')
                this.enterUnits().click({ force: true }).type('{downarrow}{enter}', { force: true })
            cy.get('button').contains('Confirm').click()
            cy.get('button').contains('Yes').click()
            this.toastMessage().contains('Reservation Approved')
            resolve();
        })
    }
}