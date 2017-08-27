let email = require('./../server/util/email/emailClient');
//const config = require('./../server/config'); // load config

// emailClient.js already read this config.
// emailClient.setConfig() is used if you did not load the config in  process.env
let config = {
    // nodemailer setting (if you choose to use regular email)
    "emailService": "Hotmail", //https://nodemailer.com/smtp/well-known/
    "emailUser": "test1@abc.com",
    "emailPass": "secretPassword",

    // MAILJET setting
    // ref https://app.mailjet.com/account/setup
    "mailjet_email": "test1@abc.com",
    "mailjet_api": "apiKey",
    "mailjet_secret": "mailjet_secret",

    //  regular or  mailjet (choose to use regular email or mailjet)
    "emailGateway": "regular",
    "sendEmail": true,

    // optional setting for advance features

    // if debug or dev is true, all email or sms will send to admins
    "debug": false,
    "dev": false,
    "admins": [{
        "name": "Admin 1",
        "email": "test@abc.com",
        "phoneNumber": 2223334444,
        "carrier": "att" // refer to  https://github.com/jefftham/email-to-phone#list
    }]

};

email.setConfig(config);

// send email
email.sendEmail('toReceive@abc.com', 'test email message', 'test subject');

// send sms through email
// refer https://www.npmjs.com/package/email-to-phone
// subject should be short, or it can't deliver
email.sendEmail('2223334444@vzwpix.com', 'test email message', 'sub', true);
