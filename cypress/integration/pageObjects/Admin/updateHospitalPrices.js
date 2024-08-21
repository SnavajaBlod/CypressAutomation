export default class updateBloodbankPrices {
    getHospitalPricing(input) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#updatehospitaldetails').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            let values = {}
            cy.get('input').type(input.hospitalData.name).type('{enter}')
            cy.get('body > div > div > div:nth-of-type(2) > div > div:nth-of-type(2) > section > div:nth-of-type(3) > div > div > div > div').then(scheme => {
                values['schemeName'] = scheme.text()
                cy.log('in scheme'+values.schemeName)
                if (values.schemeName === 'Flat Platform Fee Package') {
                    this.flatPlatformPackage().then(value => {
                        values['schemeDetails'] = value
                        resolve(values)
                    })
                }
                else if (values.schemeName === 'Deprecated Platform Fee Package') {
                    this.deprecatedPlatformPackage().then(value => {
                        values['schemeDetails'] = value
                        resolve(values)
                    })
                }
                else if (values.schemeName === 'Blood Flat Package') {
                    this.bloodFlatPackage().then(value => {
                        values['schemeDetails'] = value
                        resolve(values)
                    })
                }
            })
        })
    }
    flatPlatformPackage() {
        let values = {}
        return new Cypress.Promise((resolve) => {
            cy.get(':nth-child(2) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(4) > .sc-gLXSEc > [style="display: flex; gap: 0px; align-items: center; border: 1px solid var(--gray-300, #d0d5dd); border-radius: 0.25rem;"] > .sc-pFPEP').invoke('val').then(amount => {
                values['platformAmount'] = amount
            })
            cy.get(':nth-child(2) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #amount').invoke('val').then(amount => {
                values['platformDiscount'] = amount
            })
            cy.get(':nth-child(2) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #type > .css-wokzkm-control').then(amount => {
                values['platformDiscountUnit'] = amount.text()
            })
            cy.get(':nth-child(3) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(4) > .sc-gLXSEc > [style="display: flex; gap: 0px; align-items: center; border: 1px solid var(--gray-300, #d0d5dd); border-radius: 0.25rem;"] > .sc-pFPEP').invoke('val').then(amount => {
                values['deliveryBaseAmount'] = amount
            })
            cy.get(':nth-child(3) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #amount').invoke('val').then(amount => {
                values['deliveryBaseDiscount'] = amount
            })
            cy.get(':nth-child(3) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #type > .css-wokzkm-control').then(amount => {
                values['deliveryBaseDiscountUnit'] = amount.text()
            })
            cy.get(':nth-child(4) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(4) > .sc-gLXSEc > [style="display: flex; gap: 0px; align-items: center; border: 1px solid var(--gray-300, #d0d5dd); border-radius: 0.25rem;"] > .sc-pFPEP').invoke('val').then(amount => {
                values['deliveryAmount'] = amount
            })
            cy.get(':nth-child(4) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #amount').invoke('val').then(amount => {
                values['deliveryDiscount'] = amount
            })
            cy.get(':nth-child(4) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #type > .css-wokzkm-control').then(amount => {
                values['deliveryDiscountUnit'] = amount.text()
            })
            cy.get(':nth-child(2) > :nth-child(2) > .sc-gLXSEc > .sc-euGpHm').invoke('val').then(amount => {
                values['distanceThreshold'] = amount
                resolve(values)
            })
        })
    }
    deprecatedPlatformPackage() {
        let values = {}
        return new Cypress.Promise((resolve) => {
            cy.get(':nth-child(2) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(4) > .sc-gLXSEc > [style="display: flex; gap: 0px; align-items: center; border: 1px solid var(--gray-300, #d0d5dd); border-radius: 0.25rem;"] > .sc-pFPEP').invoke('val').then(amount => {
                values['platformPercent'] = amount
            })
            cy.get(':nth-child(2) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #amount').invoke('val').then(amount => {
                values['platformDiscount'] = amount
            })
            cy.get(':nth-child(2) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #type > .css-wokzkm-control').then(amount => {
                values['platformDiscountUnit'] = amount.text()
            })
            cy.get(':nth-child(3) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(4) > .sc-gLXSEc > [style="display: flex; gap: 0px; align-items: center; border: 1px solid var(--gray-300, #d0d5dd); border-radius: 0.25rem;"] > .sc-pFPEP').invoke('val').then(amount => {
                values['deliveryBaseAmount'] = amount
            })
            cy.get(':nth-child(3) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #amount').invoke('val').then(amount => {
                values['deliveryBaseDiscount'] = amount
            })
            cy.get(':nth-child(3) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #type > .css-wokzkm-control').then(amount => {
                values['deliveryBaseDiscountUnit'] = amount.text()
            })
            cy.get(':nth-child(4) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(4) > .sc-gLXSEc > [style="display: flex; gap: 0px; align-items: center; border: 1px solid var(--gray-300, #d0d5dd); border-radius: 0.25rem;"] > .sc-pFPEP').invoke('val').then(amount => {
                values['deliveryAmount'] = amount
            })
            cy.get(':nth-child(4) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #amount').invoke('val').then(amount => {
                values['deliveryDiscount'] = amount
            })
            cy.get(':nth-child(4) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #type > .css-wokzkm-control').then(amount => {
                values['deliveryDiscountUnit'] = amount.text()
            })
            cy.get(':nth-child(2) > :nth-child(2) > .sc-gLXSEc > .sc-euGpHm').invoke('val').then(amount => {
                values['distanceThreshold'] = amount
                resolve(values)
            })
        })
    }
    bloodFlatPackage() {
        let values = {}
        return new Cypress.Promise((resolve) => {
            cy.get(':nth-child(2) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(4) > .sc-gLXSEc > [style="display: flex; gap: 0px; align-items: center; border: 1px solid var(--gray-300, #d0d5dd); border-radius: 0.25rem;"] > .sc-pFPEP').invoke('val').then(amount => {
                values['reservationAmount'] = amount
            })
            cy.get(':nth-child(2) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #amount').invoke('val').then(amount => {
                values['reservationDiscount'] = amount
            })
            cy.get(':nth-child(2) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #type > .css-wokzkm-control').then(amount => {
                values['reservationDiscountUnit'] = amount.text()
            })
            cy.get(':nth-child(3) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(4) > .sc-gLXSEc > [style="display: flex; gap: 0px; align-items: center; border: 1px solid var(--gray-300, #d0d5dd); border-radius: 0.25rem;"] > .sc-pFPEP').invoke('val').then(amount => {
                values['regularAmount'] = amount
            })
            cy.get(':nth-child(3) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #amount').invoke('val').then(amount => {
                values['regularDiscount'] = amount
            })
            cy.get(':nth-child(3) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #type > .css-wokzkm-control').then(amount => {
                values['regularDiscountUnit'] = amount.text()
            })
            cy.get(':nth-child(4) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(4) > .sc-gLXSEc > [style="display: flex; gap: 0px; align-items: center; border: 1px solid var(--gray-300, #d0d5dd); border-radius: 0.25rem;"] > .sc-pFPEP').invoke('val').then(amount => {
                values['cancellationAmount'] = amount
            })
            cy.get(':nth-child(4) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #amount').invoke('val').then(amount => {
                values['cancellationDiscount'] = amount
            })
            cy.get(':nth-child(4) > :nth-child(1) > .sc-bDbPgR > tbody > tr > :nth-child(7) > .sc-gLXSEc > [style="display: flex; gap: 0px;"] > #type > .css-wokzkm-control').then(amount => {
                values['cancellationDiscountUnit'] = amount.text()
                resolve(values)
            })
        })
    }

}