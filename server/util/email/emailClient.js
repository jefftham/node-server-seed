// const config = require('./../../config');
const nodemailer = require('nodemailer');
const smtp = require('nodemailer-smtp-transport');
// const admins = require('./administrators.json');

// create reusable transporter object using the default SMTP transport
// Google Cloud Platform blocks the common email port.
// so, use mailjet instead.
// https://cloud.google.com/compute/docs/tutorials/sending-mail/using-mailjet
// https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/computeengine/mailjet.js


let config = {
    // nodemailer setting (if you choose to use regular email)
    "emailService": process.env.emailService, //https://nodemailer.com/smtp/well-known/
    "emailUser": process.env.emailUser,
    "emailPass": process.env.emailPass,

    // MAILJET setting
    "mailjet_email": process.env.mailjet_email,
    "mailjet_api": process.env.mailjet_api,
    "mailjet_secret": process.env.mailjet_secret,

    //  regular or  mailjet
    "emailGateway": process.env.emailGateway,
    "sendEmail": process.env.sendEmail
};

exports.setConfig = function (configObject) {
    config = configObject;
    takeConfig();
};

exports.getConfig = function () {
    return config;
}


let transporter = {};
let fromEmail = '';

function takeConfig() {
    if (config.emailGateway === 'regular') {
        // use regular with login

        console.log('regular email');

        fromEmail = config.emailUser;

        transporter = nodemailer.createTransport({
            service: config.emailService,
            auth: {
                user: config.emailUser,
                pass: config.emailPass
            },
            pool: true
        });
    } else if (config.emailGateway === 'mailjet') {
        // use mailjet

        console.log('mailjet email');

        fromEmail = config.mailjet_email;

        transporter = nodemailer.createTransport(smtp({
            host: 'in.mailjet.com',
            port: 2525,
            auth: {
                user: config.mailjet_api,
                pass: config.mailjet_secret
            }
        }));
    } else {
        console.error('Unknown EMAIL_GATEWAY setting in environment json');
    }

}
takeConfig();


module.exports.sendEmail = function (to, message, subject = 'subject', emailToMassaging = false) {

    console.log(new Date().toLocaleString() + ' sending Email to : ' + to);

    if (config.sendEmail) {
        let receivers = ''; // eg.  'bar@blurdybloop.com, baz@blurdybloop.com'
        let formatedMessage = '';

        if (config.debug || config.dev) {
            // in debuging mode, redirect all email to admins
            config.admins = config.admins || [];
            config.admins.forEach(function (admin) {
                receivers += admin.email + ','; // added comma at the end
            });

            receivers = receivers.slice(0, -1); // delete the ending comma

            // receivers = 'test@abc.com';

            formatedMessage = `redirect ${to} email.
            ${message}`;

        } else {
            // send email normally
            receivers = to;
            formatedMessage = message;
        }

        // setup email data
        let mailOptions = {
            from: fromEmail, // sender address
            to: receivers, // list of receivers
            subject: subject, // Subject line
            //  text: formatedMessage, // plain text body
            // html: '<p>' + formatedMessage + '</p>' // html body
        };

        if (emailToMassaging) {
            mailOptions.text = null;
            mailOptions.attachments = [{ // utf-8 string as an attachment
                filename: 'message.txt',
                content: formatedMessage
            }];
        } else {
            mailOptions.text = formatedMessage;
        }


        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(new Date().toLocaleString() + ' [emailClient.js] Could not send email to : ' + to);
                return console.error(error);
            }
            console.log(new Date().toLocaleString() + ' Message %s sent: %s', info.messageId, info.response);
            // console.log(info);
        });


    } else {
        console.log(new Date().toLocaleString() + ' SEND_EMAIL=false , email is not sent to ' + to);
    }

};
