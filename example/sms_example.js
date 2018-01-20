let sms = require('./../server/util/messaging/smsClient');
//const config = require('./../server/config'); // load config

// smsClient.js already read this config.
// smsClient.setConfig() is used if you did not load the config in  process.env

let smsConfig = {
  // Twilo setting
  twilioAccountSid: 'twilio account sid',
  twilioAuthToken: 'twilio token',
  twilioSenderNumber: '+12023350900',

  // email or twilio  (if you choose email, you need to configure it)
  smsGateway: 'twilio',
  sendSms: true,

  // if debug or dev is true, all email or sms will send to admins
  debug: process.env.debug === 'true' || false,
  dev: process.env.dev === 'true' || false,
};

sms.setConfig(smsConfig);

// send text message
sms.sendText('2223334444', 'test email message', 'test subject', 'cricket');

// send text message through email
smsConfig.smsGateway = 'email';

let emailConfig = {
  // nodemailer setting (if you choose to use regular email)
  emailService: 'Hotmail', //https://nodemailer.com/smtp/well-known/
  emailUser: 'test1@abc.com',
  emailPass: 'secretPassword',

  // MAILJET setting
  // ref https://app.mailjet.com/account/setup
  mailjet_email: 'test1@abc.com',
  mailjet_api: 'apiKey',
  mailjet_secret: 'mailjet_secret',

  //  regular or  mailjet (choose to use regular email or mailjet)
  emailGateway: 'regular',
  sendEmail: true,

  // optional setting for advance features

  // if debug or dev is true, all email or sms will send to admins
  debug: false,
  dev: false,
  admins: [
    {
      name: 'Admin 1',
      email: 'test@abc.com',
      phoneNumber: 2223334444,
      carrier: 'att', // refer to  https://github.com/jefftham/email-to-phone#list
    },
  ],
};

sms.setConfig(smsConfig, emailConfig);
sms.sendText('2223334444', 'test email message', 'test subject', 'cricket');
