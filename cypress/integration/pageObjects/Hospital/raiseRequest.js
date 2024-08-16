export default class raiseRequest {
  //element locators
  patientName() {
    return cy.get('#PatientName')
  }
  patientId() {
    return cy.get('#UHID')
  }
  age() {
    return cy.get('#Age')
  }
  gender() {
    return cy.get('#Sex div:nth-child(2) input')
  }
  bloodGroup() {
    return cy.get('#BloodGroup div:nth-child(2) input')
  }
  bloodComponent() {
    return cy.get('#Component div:nth-child(2) input')
  }
  units() {
    return cy.get('#NoOfUnits')
  }
  reason() {
    return cy.get('#Reason')
  }
  orderType() {
    return cy.get('#OrderType div:nth-child(2) input')
  }
  sampleTime() {
    return cy.get('#SamplePickupTime')
  }
  sampleDate() {
    return cy.get('#SamplePickupDay div:nth-child(2) input')
  }
  deliveryTime() {
    return cy.get('#EstimatedDeliveryTime')
  }
  deliveryDate() {
    return cy.get('#EstimatedDeliveryDay div:nth-child(2) input')
  }
  submitButton() {
    return cy.get('button span').contains('Submit Details')
  }
  confirmPriceButton() {
    return cy.get('button').contains('Confirm')
  }
  requestRaisedModal() {
    return cy.get('.swal-modal > div:nth-child(3)')
  }

  placeOrder(data) {
    
    cy.get('span').then(($spans) => {
      const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
      if (dashboardSpan) {
        cy.wrap(dashboardSpan).click();
      }
      cy.get('#raiserequest').click();
    })
    return new Cypress.Promise((resolve, reject) => {
      let requestId = null
      this.patientName().type(data.name)
      this.patientId().type(data.id, { force: true })
      this.age().type(data.age)
      this.gender().click({ force: true }).type(data.gender, { force: true }).type('{enter}')
      this.bloodGroup().click({ force: true }).type(data.bloodGroup, { force: true }).type('{enter}')
      this.bloodComponent().click({ force: true }).type(data.bloodComp, { force: true }).type('{enter}')
      this.units().type(data.unit, { force: true })
      this.reason().type(data.reason, { force: true })
      this.orderType().click({ force: true }).type(data.orderType, { force: true }).type('{enter}')
      if (data.orderType != 'Emergency') {
        this.sampleDate().click({ force: true }).type('{downarrow}{enter}')
        this.sampleTime().click({ force: true }).type('05:35')
      }
      if (data.orderType == 'Reservation') {
        this.deliveryDate().click({ force: true }).type('{downarrow}{downarrow}{enter}')
        this.deliveryTime().click({ force: true }).type('05:35')
      }
      this.submitButton().contains('Submit Details').click()
      this.confirmPriceButton().click()
      this.requestRaisedModal().then((text) => {
        requestId = text.text().split("is")[1].trim()
        cy.get('.swal-button').click()
        data.requestId=requestId
        cy.log('hello',data.requestId)
        resolve(data);
      })

    })
  }
}
