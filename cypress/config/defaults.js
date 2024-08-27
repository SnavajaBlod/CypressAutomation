const defaults = {
  // ORDER_TYPE: ['Regular', 'Emergency','Reservation'],
   ORDER_TYPE: 'Reservation',
  //  CREDIT_TYPE:['NoCredit','BlodCredit','FullCredit'],
  CREDIT_TYPE:'BlodCredit',
   // PREFERRED_BLOODBANK: ['No','Yes'],
   PREFERRED_BLOODBANK: 'No',
    UNITS: '2',
    BLOOD_COMPONENT: 'Whole Blood',
    APP_DEPLOYMENT: "https://dev.blodplus.com/",
    ADMIN_EMAIL: "bloodsupport@blod.in",
    DRIVER_DEPLOYMENT: ' https://blodplus-driver-git-test-blod-in-team.vercel.app ',
    HOSPITAL_TO_BLOODBANK:"",
    BLOODBANK_TO_HOSPITAL:"",
    BLOODBANK:"Brown Blood Bank",
    DRIVER:"ayush@blod.in",
    HUB:"IMAX Hospital",
    STATUS:"BloodbankAccepted",
    ITERATION:"5"
  };
  
  export default defaults;