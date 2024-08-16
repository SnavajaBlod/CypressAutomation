export default class liveOrders {
  //element locators
  viewDetailsButton() {
    return cy.get('tbody tr:nth-child(1) td:nth-child(12) div div div button')
  }
  viewDetailsTotal() {
    return cy.get('p:contains("Total Amount") + p')
  }
  viewDetailsPaid() {
    return cy.get('p:contains("Amount Paid") + p')
  }
  viewDetailsDue() {
    return cy.get('p:contains("Order Amount Due") + p')
  }
  viewDetailsCredit() {
    return cy.get('p:contains("Credit Amount") + p')
  }
  actionsButton()
  {
    return cy.get('tbody tr:nth-child(1) td:nth-child(7) div div div button')
  }
  approveInvoiceButton()
  {
    return cy.get('button').contains('Approve Invoice')
  }
  searchBar()
  {
    return cy.get('#global-filter')
  }

  viewDetailsPaymentInfo(requestId) {
    //returns object[paid,credit,total,due] from view details payment details
    cy.get('span').then(($spans) => {
      const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
      if (dashboardSpan) {
        cy.wrap(dashboardSpan).click();
      }
      cy.get('#liveorders').click({ force: true });
      this.searchBar().type(requestId)
     // cy.wait(8000)
    })
    return new Cypress.Promise((resolve, reject) => {
      this.viewDetailsButton().click();
      let values = {}
      this.viewDetailsTotal().then((text) => {
        let totalAmount = text.text().trim();
        values['total'] = totalAmount
      });
      this.viewDetailsPaid().then((text) => {
        let paidAmount = text.text().trim();
        values['paid'] = paidAmount
      });
      this.viewDetailsDue().then((text) => {
        let dueAmount = text.text().trim();
        values['due'] = dueAmount
      });
      this.viewDetailsCredit().then((text) => {
        let creditAmount = text.text().trim();
        values['credit'] = creditAmount
      });
      resolve(values);
    })
  }

  approveInvoice(requestId) {
    //approves invoice
    cy.get('span').then(($spans) => {
      const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
      if (dashboardSpan) {
        cy.wrap($dashboard).click();
      }
      cy.get('#liveorders').click({ force: true });
      this.searchBar().type(requestId)
    })
    return new Cypress.Promise((resolve, reject) => {
      this.actionsButton().click();
      this.approveInvoiceButton().click()
      cy.get('.Toastify div div div div:nth-child(2)', { timeout: 20000 }).contains('Delivery Set To Completed')
      resolve()
    })
  }


}