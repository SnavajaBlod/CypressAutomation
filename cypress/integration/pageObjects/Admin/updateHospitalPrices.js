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
                cy.log('in scheme' + values.schemeName)
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
    changePricingScheme(hospital, schemeName) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#updatehospitaldetails').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            let currentScheme
            cy.get('input').type(hospital).type('{enter}')
            cy.get('#selectTemplate > div > div:nth-of-type(1) > div:nth-of-type(1) ').then(text => {
                return currentScheme = text.text()
            }).then(() => {
                if (currentScheme !== schemeName) {
                    cy.get('#selectTemplate > div > div:nth-of-type(1) > div:nth-of-type(2) > input').type(schemeName, { force: true }).type('{enter}')
                    cy.get('#submit').click()
                    cy.get('button > p').contains('Confirm').click()
                    cy.get('.Toastify__toast-body > div').contains('Prices Updated Successfully!')
                }
                resolve()
            })
        })
    }
    flatPlatformPackage() {
        let values = {}
        return new Cypress.Promise((resolve) => {
            cy.get('#amount-Charge0 div > div > input').invoke('val').then(amount => {
                values['platformAmount'] = amount
            })
            cy.get('#discount-Charge0 div > div > input').invoke('val').then(amount => {
                values['platformDiscount'] = amount
            })
            cy.get('#discount-Charge0 > div > div > div > div > div:nth-of-type(1) > div:nth-of-type(1)').then(amount => {
                values['platformDiscountUnit'] = amount.text()
            })
            cy.get('#amount-Charge1 div > div > input').invoke('val').then(amount => {
                values['deliveryBaseAmount'] = amount
            })
            cy.get('#discount-Charge1 div > div > input').invoke('val').then(amount => {
                values['deliveryBaseDiscount'] = amount
            })
            cy.get('#discount-Charge1 > div > div > div > div > div:nth-of-type(1) > div:nth-of-type(1)').then(amount => {
                values['deliveryBaseDiscountUnit'] = amount.text()
            })
            cy.get('#amount-Charge2 div > div > input').invoke('val').then(amount => {
                values['deliveryAmount'] = amount
            })
            cy.get('#discount-Charge2 div > div > input').invoke('val').then(amount => {
                values['deliveryDiscount'] = amount
            })
            cy.get('#discount-Charge2 > div > div > div > div > div:nth-of-type(1) > div:nth-of-type(1)').then(amount => {
                values['deliveryDiscountUnit'] = amount.text()
            })
            cy.get('#constraintValue0').invoke('val').then(amount => {
                values['distanceThreshold'] = amount
                resolve(values)
            })
        })
    }
    deprecatedPlatformPackage() {
        let values = {}
        return new Cypress.Promise((resolve) => {
            cy.get('#amount-Charge0 div > div > input').invoke('val').then(amount => {
                values['platformPercent'] = amount
            })
            cy.get('#discount-Charge0 div > div > input').invoke('val').then(amount => {
                values['platformDiscount'] = amount
            })
            cy.get('#discount-Charge0 > div > div > div > div > div:nth-of-type(1) > div:nth-of-type(1)').then(amount => {
                values['platformDiscountUnit'] = amount.text()
            })
            cy.get('#amount-Charge1 div > div > input').invoke('val').then(amount => {
                values['deliveryBaseAmount'] = amount
            })
            cy.get('#discount-Charge1 div > div > input').invoke('val').then(amount => {
                values['deliveryBaseDiscount'] = amount
            })
            cy.get('#discount-Charge1 > div > div > div > div > div:nth-of-type(1) > div:nth-of-type(1)').then(amount => {
                values['deliveryBaseDiscountUnit'] = amount.text()
            })
            cy.get('#amount-Charge2 div > div > input').invoke('val').then(amount => {
                values['deliveryAmount'] = amount
            })
            cy.get('#discount-Charge2 div > div > input').invoke('val').then(amount => {
                values['deliveryDiscount'] = amount
            })
            cy.get('#discount-Charge2 > div > div > div > div > div:nth-of-type(1) > div:nth-of-type(1)').then(amount => {
                values['deliveryDiscountUnit'] = amount.text()
            })
            cy.get('#constraintValue0').invoke('val').then(amount => {
                values['distanceThreshold'] = amount
                resolve(values)
            })
        })
    }
    bloodFlatPackage() {
        let values = {}
        return new Cypress.Promise((resolve) => {
            cy.get('#amount-Charge0 div > div > input').invoke('val').then(amount => {
                values['reservationAmount'] = amount
            })
            cy.get('#amount-Charge1 div > div > input').invoke('val').then(amount => {
                values['regularAmount'] = amount
            })
            cy.get('#amount-Charge2 div > div > input').invoke('val').then(amount => {
                values['cancellationAmount'] = amount
                resolve(values)
            })
        })
    }

}