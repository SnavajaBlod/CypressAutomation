export default class updateBloodbankPrices {
    getBloodbankPricing(input) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#updatebloodbankprices').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            let compCharge
            let values = {}
            cy.get('label:contains("Select Blood Bank") + div > div > div > div:nth-of-type(2) > input').type(input.bloodbankData.name, { force: true }).type('{enter}')
            cy.get('#crossMatchingCharges').invoke('val').then((text) => {
                this.crossMatching = text
                cy.log(this.crossMatching)
            })
            cy.get('#reservation_charges').invoke('val').then((text) => {
                this.reservation = text
                cy.log(this.reservation)
            })
            cy.get('#negativeCharges').then((box) => {
                this.negativeCheck = box.prop('checked');
                cy.log(this.negativeCheck)
            })
            cy.get('tbody tr').each($el => {
                let n = $el.find('td:nth-child(1)').text()
                if (n === (input.bloodComp)) {
                    cy.wrap($el).find('td:nth-child(2) div input').then((cbox) => {
                        this.crossCheck = cbox.prop('checked');
                        if ((input.bloodGroup.endsWith('-')) && this.negativeCheck == true)
                            cy.wrap($el).find('td:nth-child(3) div input:nth-child(2)').invoke('val').then(txt => {
                                this.bloodCharge = txt
                                cy.log(this.bloodCharge)
                            })
                        else
                            cy.wrap($el).find('td:nth-child(3) div input:nth-child(1)').invoke('val').then(txt => {
                                this.bloodCharge = txt
                            })
                    })
                }
            }).then(() => {
                if (this.crossCheck == true)
                    compCharge = parseInt(this.bloodCharge) + parseInt(this.crossMatching)
                else
                    compCharge = this.bloodCharge
                values['componentCharge'] = compCharge
                values['reservationCharge'] = this.reservation
                resolve(values);
            })
        })
    }
}