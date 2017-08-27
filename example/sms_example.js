let sms = require('./../server/util/messaging/smsClient');
//const config = require('./../server/config'); // load config

// smsClient.js already read this config.
// smsClient.setConfig() is used if you did not load the config in  process.env

let config = {
    // Twilo setting
    "twilioAccountSid": "twilio account sid",
    "twilioAuthToken": "twilio token",
    "twilioSenderNumber": "+12023350900",

    // email or twilio  (if you choose email, you need to configure it)
    "smsGateway": "twilio",
    "sendSms": true,
};

sms.setConfig(config);

// send email
sms.sendText('2223334444', 'test email message', 'test subject', 'cricket');
