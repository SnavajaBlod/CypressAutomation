export default class raiseRequest
{
     name(){
       return cy.get('#PatientName')
     }
    placeOrder(data)
    {
        return new Cypress.Promise((resolve, reject) => {
        let requestId = null
        this.name().type("Name")
        cy.get('#UHID').type("1234")
        cy.get('#Age').type("45")
        cy.get('#Sex div:nth-child(2) input').click({force:true}).type("Male",{force:true}).type('{enter}')
        cy.get('#BloodGroup div:nth-child(2) input').click({force:true}).type("A+",{force:true}).type('{enter}')
        cy.get('#Component div:nth-child(2) input').click({force:true}).type("Packed Red Blood Cells",{force:true}).type('{enter}')
       cy.get('#NoOfUnits').type("2")
       cy.get('#Reason').type("reason")
        cy.get('#OrderType div:nth-child(2) input').click({force:true}).type("Regular",{force:true}).type('{enter}')
        cy.get('#SamplePickupDay div:nth-child(2) input').click({force:true}).type('{downarrow}{downarrow}{enter}')
        cy.get('#SamplePickupTime').click({force:true}).type('05:35')
        cy.get('button span').contains('Submit Details').click()
        cy.get('button').contains('Confirm').click()
     cy.get('.swal-modal > div:nth-child(3)').then((text)=>
    {
        requestId = text.text().split("is")[1].trim()
        cy.get('.swal-button').click()
        resolve(requestId);
    })
   

       
         })
        }
}
