export default class driverMapping
{
    mapDriver(requestId)
    {
        return new Cypress.Promise((resolve, reject) => {
        console.log("driverpage"+requestId)
        cy.get('input[placeholder="Enter the Request ID"]').type(requestId)
        cy.get('button').contains('Go').click()
        cy.get('label:contains("Select Blood Bank") + div > div > div > div > input').type("Brown Blood Bank").type('{enter}')
        cy.get('label:contains("Select Hub") + div > div > div > div > input').click().type('{enter}')
        cy.get('label:contains("Select Delivery Driver") + div > div > div > div > input').type('ayush@blod.in').type('{enter}')
        cy.get('button').contains('SUBMIT').click()
        cy.get('.swal-button--confirm').click()
        resolve()
        })
        
    }
}
