export default class bloodbankList {
    getBloodbankDetails(input) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#bloodbanklist').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            let values={}
            cy.get('#global-filter').type(input.bloodbankData.name)
            cy.get('tbody tr td:nth-of-type(3)').then((text)=>
            {
                values['email']=text.text()
            })
            cy.get('tbody tr td:nth-of-type(4)').then((text)=>
                {
                    values['address']=text.text()
                }).then(()=>{
                    resolve(values)
                })
               
           
            
           
        })




    }
}