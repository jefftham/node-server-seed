// const config = require('./../../config');
const email = require('./../email/emailClient');
const carrierLookup = require('email-to-phone');


let config = {

    // Twilo setting
    "twilioAccountSid": process.env.twilioAccountSid,
    "twilioAuthToken": process.env.twilioAuthToken,
    "twilioSenderNumber": process.env.twilioSenderNumber,

    // email or twilio
    "smsGateway": process.env.smsGateway,
    "sendSms": process.env.smsGateway,
};

exports.setConfig = function (configObject) {
    config = configObject;
};

exports.getConfig = function () {
    return config;
}


let transporter = {};
let fromEmail = '';

module.exports.sendText = function (to, message, subject = 'subject', carrier = '') {

    console.log(new Date().toLocaleString() + ' sending SMS to : ' + to);

    if (config.sendSms) {
        // send sms is on
        if (config.debug) {
            // in debuging mode, redirect all sms to admins through email
            email.sendEmail(to, message, true);
        } else {
            // is sendSms = true && not in debug mode

            if (config.smsGateway === 'email') {
                // use email to sms

                console.log('send SMS by email');

                let toAddress = to;

                if (!carrier) {
                    // carrier is falsy
                    return;
                } else {
                    let obj = carrierLookup.lookup(carrier); // make use of the fuzzy search
                    toAddress = carrierLookup.mms_sms(obj.name, to); // mms or sms
                }

                email.sendEmail(toAddress, message, subject, true);

            } else if (config.smsGateway === 'twilio') {
                // use twilio

                const twilio = require('twilio')(config.twilioAccountSid, config.twilioAuthToken);

                console.log('send SMS by twilio');
                twilio.messages.create({
                    body: message,
                    to: to,
                    from: config.twilioSenderNumber
                    //  mediaUrl: imageUrl
                }, function (err, info) {
                    if (err) {
                        console.error(new Date().toLocaleString() + ' [smsClient.js]  Could not send sms to : ' + to);
                        console.error(err);
                    } else {
                        console.log(new Date().toLocaleString() + ' Message %s sent: %s', info.sid, info.to);
                        // console.log(info)
                    }
                });

            } else {
                console.error('Unknown SMS_GATEWAY setting in environment json');
            }

        }


    } else {
        console.log(new Date().toLocaleString() + ' SEND_SMS=false , sms is not sent to ' + to);
    }


};
