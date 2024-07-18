// Corrected structure for liveOrders class with viewDetails method
export default class liveOrders {
  viewDetails() {
    return new Cypress.Promise((resolve, reject) => {
      cy.get('tbody tr:nth-child(1) td:nth-child(12) div div div button').click();

      let values = {}

      cy.get('p:contains("Total Amount") + p').then((text) => {
        let totalAmount = text.text().trim();
        values['total'] = totalAmount
      });

      cy.get('p:contains("Amount Paid") + p').then((text) => {
        let paidAmount = text.text().trim();
        values['paid'] = paidAmount
      });

      cy.get('p:contains("Order Amount Due") + p').then((text) => {
        let dueAmount = text.text().trim();
        values['due'] = dueAmount
      });

      cy.get('p:contains("Credit Amount") + p').then((text) => {
        let creditAmount = text.text().trim();
        values['credit'] = creditAmount
      });
      resolve(values); // Resolve the promise with the populated amounts object  
    })

  }
  approveInvoice()
  {
    return new Cypress.Promise((resolve, reject) => {
     // cy.get('span').contains('Dashboard').click()
      //cy.get('#liveorders').click()
      cy.get('tbody tr:nth-child(1) td:nth-child(7) div div div button').click();
      cy.get('button').contains('Approve Invoice').click()
      //div[@class='Toastify']/div/div/div/div/2][text()='Delivery Set To Completed!']
      cy.get('.Toastify div div div div:nth-child(2)',{timeout: 10000}).contains('Delivery Set To Completed')
      resolve()
    })
  }
}