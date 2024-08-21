export default class bloodbankList {
    getHospitalDetails(input) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#hospitallist').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            let values={}
            cy.get('#global-filter').type(input.hospitalData.name)
            //tbody/tr/td[2]/div/div[1]/span
            cy.get('tbody > tr > td:nth-of-type(2) > div > div:nth-of-type(1) > span').then((text)=>
            {
                values['email']=text.text()
            })
            cy.get('tbody tr td:nth-of-type(3)').then((text)=>
                {
                    values['address']=text.text()
                }).then(()=>{
                    resolve(values)
                })
               
           
            
           
        })




    }
}