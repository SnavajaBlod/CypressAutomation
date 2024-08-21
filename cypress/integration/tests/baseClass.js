
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
                hname = "Ponky Half Credit Hospital"
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
    assignDataValues(input, bloodbank, hospital, bbPricing, hospPricing, a, b) {
        input.bloodbankData.email = bloodbank.email
        input.bloodbankData.address = bloodbank.address
        input.hospitalData.email = hospital.email
        input.hospitalData.address = hospital.address
        input.bloodbankData.componentCharge = bbPricing.componentCharge
        input.bloodbankData.reservationCharge = bbPricing.reservationCharge
        input.hospitalData.schemeName = hospPricing.schemeName
        input.hospitalData.schemeDetails = hospPricing.schemeDetails
        return input
    }
    setInitialData(orderData, pages, orderType, creditType, prefBloodbank) {
        let values
        orderData.orderType = orderType
        orderData.prefBloodbank = prefBloodbank
        orderData.bloodComp = Cypress.env("BLOOD_COMPONENT")
        orderData.units = Cypress.env("UNITS")
        orderData = this.getHospital(orderData, creditType)
        orderData = this.getBloodbank(orderData)
        return new Cypress.Promise((resolve, reject) => {
            pages.bloodbankList.getBloodbankDetails(orderData).then((data) => {
                this.bbData = data
            })
            pages.hospitalList.getHospitalDetails(orderData).then((data) => {
                this.hospData = data
            })
            pages.hospitalPrices.getHospitalPricing(orderData).then((data) => {
                this.hospPricing = data
            })
            pages.bloodbankPrices.getBloodbankPricing(orderData).then((data) => {
                console.log('help' + data.componentCharge)
                this.bbPricing = data
                console.log('help' + this.bbPricing.componentCharge)
            }).then(() => {
                values = this.assignDataValues(orderData, this.bbData, this.hospData, this.bbPricing, this.hospPricing)
                this.setDistances(orderData).then((val) => {
                    values = val
                    resolve(values)
                })
            })
        })
    }
    setDistances(orderData) {
        return new Cypress.Promise((resolve, reject) => {
            cy.getDistances(orderData.hospitalData.address, orderData.bloodbankData.address).then((dist) => {
                orderData.hospitalToBloodbank = dist
                return cy.getDistances(orderData.bloodbankData.address, orderData.hospitalData.address)
            }).then((dist) => {
                return orderData.bloodbankToHospital = dist
            }).then(() => {
                resolve(orderData)
            })
        })



    }
    getInvoiceValues(orderData) {
        if (orderData.hospitalData.schemeName === 'Flat Platform Fee Package')
            orderData = this.flatPlatformPackage(orderData)
        else if (orderData.hospitalData.schemeName === 'Deprecated Platform Fee Package')
            orderData = this.deprecatedPlatformPackage(orderData)
        else if (orderData.hospitalData.schemeName === 'Blood Flat Package')
            orderData = this.bloodFlatPackage(orderData)
        orderData = this.assignCredits(orderData)
        return orderData
    }
    flatPlatformPackage(data) {
        let bloodbankTotal, blodTotal, platformFeeBeforeTax, platformFeeAfterTax, platformFeeCSGST,platformFeeBeforeDiscount
        let deliveryBaseBeforeTax, deliveryBaseAfterTax, deliveryBaseCSGST,deliveryBaseBeforeDiscount
        let deliveryAfterTax, deliveryBeforeTax, deliveryCSGST, totalDistance,deliveryBeforeDiscount
        let values = {}
        let states = ['Request Raised', 'Blood Bank Accepted', 'Agent Arrived', 'Sample Acquired', 'Cross Matching', 'Reserved']
        //bloodbank fee
        if (data.orderType === 'Reservation')
            bloodbankTotal = Number(data.bloodbankData.reservationCharge) * Number(data.units)
        else
            bloodbankTotal = Number(data.bloodbankData.componentCharge) * Number(data.units)
        //platform fee
        platformFeeBeforeDiscount = Number(data.hospitalData.schemeDetails.platformAmount)
        platformFeeBeforeTax = this.applyDiscount(data.hospitalData.schemeDetails.platformDiscountUnit, platformFeeBeforeDiscount, Number(data.hospitalData.schemeDetails.platformDiscount))
        platformFeeCSGST = platformFeeBeforeTax * 0.09
        platformFeeAfterTax = platformFeeBeforeTax * 1.18
        //delivery base fee
        deliveryBaseBeforeDiscount = Number(data.hospitalData.schemeDetails.deliveryBaseAmount)
        deliveryBaseBeforeTax = this.applyDiscount(data.hospitalData.schemeDetails.deliveryBaseDiscountUnit, deliveryBaseBeforeDiscount, Number(data.hospitalData.schemeDetails.deliveryBaseDiscount))
        deliveryBaseCSGST = deliveryBaseBeforeTax * 0.09
        deliveryBaseAfterTax = deliveryBaseBeforeTax * 1.18
        //delivery distance fee
        totalDistance = Number(data.hospitalToBloodbank.split(' ')[0]) + Number(data.bloodbankToHospital.split(' ')[0])
        deliveryBeforeDiscount = (totalDistance - Number(data.hospitalData.schemeDetails.distanceThreshold)) * Number(data.hospitalData.schemeDetails.deliveryAmount)
        deliveryBeforeTax = this.applyDiscount(data.hospitalData.schemeDetails.deliveryDiscountUnit, deliveryBeforeDiscount, Number(data.hospitalData.schemeDetails.deliveryDiscount))
        deliveryCSGST = deliveryBeforeTax * 0.09
        deliveryAfterTax = deliveryBeforeTax * 1.18
        blodTotal = platformFeeAfterTax + deliveryBaseAfterTax + deliveryAfterTax
        //assign values
        values['totalAmount'] = (bloodbankTotal + blodTotal).toFixed(2)
        values['bloodbankTotal'] = (bloodbankTotal).toFixed(2)
        values['blodTotal'] = (blodTotal).toFixed(2)
        values['platformFeeBD']=(platformFeeBeforeDiscount).toFixed(2)
        values['platformFeeBT'] = (platformFeeBeforeTax).toFixed(2)
        values['platformFeeAT'] = (platformFeeAfterTax).toFixed(2)
        values['platformFeeTax'] = (platformFeeCSGST).toFixed(2)
        values['deliveryBaseBD']=(deliveryBaseBeforeDiscount).toFixed(2)
        values['deliveryBaseBT'] = (deliveryBaseBeforeTax).toFixed(2)
        values['deliveryBaseAT'] = (deliveryBaseAfterTax).toFixed(2)
        values['deliveryBaseTax'] = (deliveryBaseCSGST).toFixed(2)
        values['deliveryDistanceBD']=(deliveryBeforeDiscount).toFixed(2)
        values['deliveryDistanceBT'] = (deliveryBeforeTax).toFixed(2)
        values['deliveryDistanceAT'] = (deliveryAfterTax).toFixed(2)
        values['deliveryDistanceTax'] = (deliveryCSGST).toFixed(2)
        data.invoiceDetails = values
        return data
    }
    deprecatedPlatformPackage(data) {
        let bloodbankTotal, blodTotal, platformFeeBeforeTax, platformFeeAfterTax, platformFeeCSGST
        let deliveryBaseBeforeTax, deliveryBaseAfterTax, deliveryBaseCSGST
        let deliveryAfterTax, deliveryBeforeTax, deliveryCSGST, totalDistance
        let values = {}
        let states = ['Request Raised', 'Blood Bank Accepted', 'Agent Arrived', 'Sample Acquired', 'Cross Matching', 'Reserved']
        //bloodbank fee
        if (data.orderType === 'Reservation')
            bloodbankTotal = Number(data.bloodbankData.reservationCharge) * Number(data.units)
        else
            bloodbankTotal = Number(data.bloodbankData.componentCharge) * Number(data.units)
        //delivery base fee
        deliveryBaseBeforeTax = Number(data.hospitalData.schemeDetails.deliveryBaseAmount)
        deliveryBaseBeforeTax = this.applyDiscount(data.hospitalData.schemeDetails.deliveryBaseDiscountUnit, deliveryBaseBeforeTax, Number(data.hospitalData.schemeDetails.deliveryBaseDiscount))
        deliveryBaseCSGST = deliveryBaseBeforeTax * 0.09
        deliveryBaseAfterTax = deliveryBaseBeforeTax * 1.18
        //delivery distance fee
        totalDistance = Number(data.hospitalToBloodbank.split(' ')[0]) + Number(data.bloodbankToHospital.split(' ')[0])
        deliveryBeforeTax = (totalDistance - Number(data.hospitalData.schemeDetails.distanceThreshold)) * Number(data.hospitalData.schemeDetails.deliveryAmount)
        deliveryBeforeTax = this.applyDiscount(data.hospitalData.schemeDetails.deliveryDiscountUnit, deliveryBeforeTax, Number(data.hospitalData.schemeDetails.deliveryDiscount))
        deliveryCSGST = deliveryBeforeTax * 0.09
        deliveryAfterTax = deliveryBeforeTax * 1.18
        //platform fee
        platformFeeBeforeTax = Number(data.hospitalData.schemeDetails.platformPercent) * (bloodbankTotal + deliveryBaseBeforeTax + deliveryBeforeTax)
        platformFeeBeforeTax = this.applyDiscount(data.hospitalData.schemeDetails.platformDiscountUnit, platformFeeBeforeTax, Number(data.hospitalData.schemeDetails.platformDiscount))
        platformFeeCSGST = platformFeeBeforeTax * 0.09
        platformFeeAfterTax = platformFeeBeforeTax * 1.18
        blodTotal = platformFeeAfterTax + deliveryBaseAfterTax + deliveryAfterTax
        //assign values
        values['totalAmount'] = bloodbankTotal + blodTotal
        values['bloodbankTotal'] = bloodbankTotal
        values['blodTotal'] = blodTotal
        values['platformFeeBT'] = platformFeeBeforeTax
        values['platformFeeAT'] = platformFeeAfterTax
        values['platformFeeTax'] = platformFeeCSGST
        values['deliveryBaseBT'] = deliveryBaseBeforeTax
        values['deliveryBaseAT'] = deliveryBaseAfterTax
        values['deliveryBaseTax'] = deliveryBaseCSGST
        values['deliveryDistanceBT'] = deliveryBeforeTax
        values['deliveryDistanceAT'] = deliveryAfterTax
        values['deliveryDistanceTax'] = deliveryCSGST
        data.invoiceDetails = values
        return data
    }
    bloodFlatPackage(data) {
        let values = {}
        let bloodbankTotal, totalAmount, blodAmountAfterTax, blodAmountBeforeTax, blodAmountCSGST
        if (data.orderType === 'Reservation') {
            bloodbankTotal = Number(data.bloodbankData.reservationCharge) * Number(data.units)
            totalAmount = Number(data.hospitalData.schemeDetails.reservationAmount) * Number(data.units)
        }
        else {
            bloodbankTotal = Number(data.bloodbankData.componentCharge) * Number(data.units)
            totalAmount = Number(data.hospitalData.schemeDetails.regularAmount) * Number(data.units)
        }
        blodAmountAfterTax = totalAmount - bloodbankTotal
        blodAmountBeforeTax = blodAmountAfterTax / 1.18
        blodAmountCSGST = blodAmountBeforeTax * 0.09
        values['totalAmount'] = bloodbankTotal + blodAmountAfterTax
        values['bloodbankTotal'] = bloodbankTotal
        values['blodTotal'] = blodAmountAfterTax
        values['blodAmountTax'] = blodAmountCSGST
        values['blodAmountBT'] = blodAmountBeforeTax
        data.invoiceDetails = values
        return data
    }
    applyDiscount(unit, amount, discountValue) {
        if (unit == '₹')
            amount = amount - discountValue
        else if (unit == '%')
            amount = amount * (1 - (discountValue / 100))
        return amount
    }
    assignCredits(data) {
        let values = {}
        if (data.hospitalData.creditType === 'FullCredit') {
            values['Total'] = data.invoiceDetails.totalAmount
            values['Due'] = 'N/A'
            values['Paid'] = 'N/A'
            values['Credit'] = data.invoiceDetails.totalAmount
        }
        else if (data.hospitalData.creditType === 'BlodCredit') {
            values['Total'] = data.invoiceDetails.totalAmount
            values['Due'] = data.invoiceDetails.bloodbankTotal
            values['Paid'] = 'N/A'
            values['Credit'] = data.invoiceDetails.blodTotal
        }
        else if (data.hospitalData.creditType === 'NoCredit') {
            values['Total'] = data.invoiceDetails.totalAmount
            values['Due'] = data.invoiceDetails.totalAmount
            values['Paid'] = 'N/A'
            values['Credit'] = 'N/A'
        }
        data.paymentDetails = values
        return data
    }
     convertPdfToText() {
        const filePath = 'C:\\Users\\VC\\Downloads\\190c845b-a-hospital-Preferred No Credit Hospital-invoice.pdf'
        cy.task('readPdf',filePath).then(data=>{
            let newData=data.text.replace(/\r?\n|\r/g, ' ').trim();
            console.log(newData)
     })
    }
    getExpectedInvoice(data){
        const str=[]
        str.push('TAX INVOICE Address: IMAX Hospital, No.128, D Block, 1st Main road, Kilpauk Garden Road, Annanagar East, Chennai, Tamil Nadu 600102 Email ID: info@blod.in Phone No.: 9884516787 GST No.: 33AAKCB7626E1ZS PAN No.: AAKCB7626E')
        str.push('State: TAMIL NADU State Code: TN Place of Supply: CHENNAI Details of HospitalDetails of Patient')
        str.push('Name: '+data.hospitalData.name+' Address: '+data.hospitalData.address+' State: TAMIL NADU State Code: TN GST No.: - PAN No.: - Name: '+data.name+' Age: '+data.age+' Request ID: '+data.requestId+' Patient ID: '+data.id+' Sex: '+data.gender+' Blood Group: '+data.bloodGroup+' Blood Component: '+data.bloodComp+' No. of units: '+data.units+' Reason: '+data.reason+' Sr. No Description of Goods/Services HSN/SAC Code QuantityUOM Total Before Tax (INR) CGSTSGST Total Value (INR) RateAmountRateAmount')
     //   str.push('Platform Fees9973311-'399.00'9'35.91'9'35.91'470.82') 
      //  str.push('Delivery Protocol Base Fee 996519'2'Data Points '354.000.00'9'0.00'9'0.00'0.00')
       // ('Delivery Protocol Distance Fee 9965194.4Data Points 103.840.0090.0090.000.00')
       // 'Details for Transfer of Funds in INRTotal Amount Before TaxINR 399.00 Total SGSTINR 35.91 Total CGSTINR 35.91 Total AmountINR 470.82 Total Amount (Rounded Off)INR 471.00' 
       // 'Prepared By BLODIN PVT LTDChecked By & Date: 16/08/2024 Terms and Conditions www.blod.in/tnp'
    }
}