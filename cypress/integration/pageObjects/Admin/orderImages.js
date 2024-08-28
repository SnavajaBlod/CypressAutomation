export default class orderImages {
    agentArrived(requestId) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#orderimages').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            cy.get('input').type(requestId.split('-')[0])
            cy.get('button').contains('Search').click()
            cy.get('p').contains('Agent Arrived')
            cy.get('#header0UploadComponent').then((fileInput) => {
                this.uploadImage(fileInput)
                
            }).then(() => {
                cy.get('button').contains('Upload').click()
                cy.get('.swal-title').contains('Success')
                cy.get('.swal-button--confirm').click()
                resolve()
            })
        })
    }
    sampleAcquired(requestId, creditType) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#orderimages').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            let amount = null
            cy.get('input').type(requestId.split('-')[0])
            cy.get('button').contains('Search').click()
            cy.get('p').contains('Sample Acquired')
            cy.get('#header0UploadComponent').then((fileInput) => {
                this.uploadImage(fileInput)
            })
            cy.get('#header1UploadComponent').then((fileInput) => {
                this.uploadImage(fileInput)
            })
            cy.get('#header2UploadComponent').then((fileInput) => {
                this.uploadImage(fileInput)
            })
            cy.get('button').contains('Upload').click().then(() => {
                if (creditType != 'FullCredit') {
                    cy.get('input[value="Cash"]').click()
                    cy.get('button').contains('Confirm').click()
                }
            })
            cy.get('.swal-title').contains('Success')
            cy.get('.swal-button--confirm').click().then(() => {
                resolve(amount)
            })


        })
    }
    crossMatching(requestId) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#orderimages').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            cy.get('input').type(requestId.split('-')[0])
            cy.get('button').contains('Search').click()
            cy.get('p').contains('Cross Matching')
            cy.get('#header0UploadComponent').then((fileInput) => {
                return this.uploadImage(fileInput)
            }).then(() => {
                cy.get('button').contains('Upload').click()
                cy.get('.swal-title').contains('Success')
                cy.get('.swal-button--confirm').click()
                resolve()
            })
        })
    }
    reserved(requestId) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#orderimages').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            cy.get('input').type(requestId.split('-')[0])
            cy.get('button').contains('Search').click()
            cy.get('p').contains('Reserved')
            cy.get('#header0UploadComponent').then((fileInput) => {
                return this.uploadImage(fileInput)
            }).then(() => {
                cy.get('button').contains('Upload').click()
                cy.get('.swal-title').contains('Success')
                cy.get('.swal-button--confirm').click()
                resolve()
            })
        })
    }
    agentAtBloodbank(requestId) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#orderimages').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            cy.get('input').type(requestId.split('-')[0])
            cy.get('button').contains('Search').click()
            cy.get('p').contains('Agent At BloodBank')
            cy.get('#header0UploadComponent').then((fileInput) => {
                return this.uploadImage(fileInput)
            }).then(() => {
                cy.get('button').contains('Upload').click()
                cy.get('.swal-title').contains('Success')
                cy.get('.swal-button--confirm').click()
                resolve()
            })
        })
    }
    issued(requestId) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#orderimages').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            cy.get('input').type(requestId.split('-')[0])
            cy.get('button').contains('Search').click()
            cy.get('p').contains('Issued')
            cy.get('#header0UploadComponent').then((fileInput) => {
                return this.uploadImage(fileInput)
            }).then(() => {
                return cy.get('#header1UploadComponent')
            }).then((fileInput) => {
                return this.uploadImage(fileInput)
            }).then(() => {
                return cy.get('#header2UploadComponent')
            }).then((fileInput) => {
                return this.uploadImage(fileInput)
            }).then(() => {
                return cy.get('#header3UploadComponent')
            }).then((fileInput) => {
                return this.uploadImage(fileInput)
            }).then(() => {
                return cy.get('#header4UploadComponent')
            }).then((fileInput) => {
                return this.uploadImage(fileInput)
            }).then(() => {
                cy.get('button').contains('Upload').click()
                cy.get('.swal-title').contains('Success')
                cy.get('.swal-button--confirm').click()
                resolve()
            })
        })
    }
    delivered(requestId, creditType, orderType) {
        cy.get('span').then(($spans) => {
            const dashboardSpan = $spans.toArray().find(span => span.innerText.includes('Dashboard'));
            if (dashboardSpan) {
                cy.wrap(dashboardSpan).click();
            }
            cy.get('#orderimages').click({ force: true });
        })
        return new Cypress.Promise((resolve, reject) => {
            let amount = null
            cy.get('input').type(requestId.split('-')[0])
            cy.get('button').contains('Search').click()
            cy.get('p').contains('Delivered')
            cy.get('#header0UploadComponent').then((fileInput) => {
                return this.uploadImage(fileInput)
            }).then(() => {
                cy.get('button').contains('Upload').click()
                if ((creditType != 'FullCredit') && (orderType === 'Reservation'))
                    amount = this.collectPayment()
                cy.get('.swal-title').contains('Success')
                cy.get('.swal-button--confirm').click()
                resolve()
            })
        })
    }
    collectPayment() {
        cy.get('input[value="Cash"]').click()
        cy.get('button').contains('Confirm').click()

    }
    uploadImage(fileInput) {
        cy.fixture('8.png', 'base64').then(fileContent => {
            const blob = Cypress.Blob.base64StringToBlob(fileContent, 'image/png');
            const file = new File([blob], '8.png', { type: 'image/png' });
            // Create a DataTransfer object and add the file to it
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput[0].files = dataTransfer.files;
            // Trigger the change event on the file input
            cy.wrap(fileInput).trigger('change', { force: true });
            
        })
    }
}