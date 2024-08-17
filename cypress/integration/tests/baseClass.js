export default class baseClass {
    convertToArray(input) {
        if (!Array.isArray(input))
            input = [input]
        return input
    }
    getHospital(data, credit) {
        let hname, hemail;
        data.hospitalData = {}
        if (data.prefBloodbank == 'Yes') {
            if (credit == 'FullCredit') {
                hemail = 'pfullcredit@gmail.com'
                hname = "Preferred Full Credit Hospital"
            }
            else if (credit == 'NoCredit') {
                hemail = "pnocredit@gmail.com"
                hname = "Preferred No Credit Hospital"
            }
            else if (credit == "BlodCredit") {
                hemail = "pblodcredit@gmail.com"
                hname = "Preferred Blod Credit Hospital"
            }
        }
        else if (data.prefBloodbank == 'No') {
            if (credit == 'FullCredit') {
                hemail = 'inky@gmail.com'
                hname = "Inky Full Credit Hospital"
            }
            else if (credit == 'NoCredit') {
                hemail = "pinky@gmail.com"
                hname = "Pinky No Credit Hospital"
            }
            else if (credit == "BlodCredit") {
                hemail = "ponky@gmail.com"
                hname = "Ponky Blod Credit Hospital"
            }
        }
        data.hospitalData.name = hname
        data.hospitalData.email = hemail
        data.hospitalData.creditType = credit
        return data
    }
    getBloodbank(data) {
        data.bloodbankData = {}
        const bloodbank = Cypress.env("BLOODBANK")
        data.bloodbankData.name = bloodbank
     //   data.bloodbankData.email = bloodbank.email

        return data
    }
    getDist() {
        let hospital = 'fsd'
        let bloodbank = 'sfd'
        let dist
        cy.getDistances(hospital, bloodbank)
    }
    setOrderData(data, orderType, creditType, prefBloodbank) {
        data.orderType = orderType
        data.prefBloodbank = prefBloodbank
        data.bloodComp = Cypress.env("BLOOD_COMPONENT")
        data.unit = Cypress.env("UNITS")
        data = this.getHospital(data, creditType)
        data = this.getBloodbank(data)
        return data
    }

}