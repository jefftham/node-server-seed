const smsClient = require('./smsClient');
const fs = require('fs');
const config = require('./../../config');

function formatMessage(errorToReport) {
    return new Date().toLocaleString() + ' ALERT! It appears the server is' +
        ' having issues. Exception: ' + errorToReport;
}

// use to notify server error
exports.notifyOnError = function (appError, request, response, next) {
    config.admins.forEach(function (admin) {
        let messageToSend = formatMessage(appError.message);
        smsClient.sendText(admin.phoneNumber, messageToSend, `${new Date().toLocaleString() } Server error`, admin.carrier);
    });
    next(appError);
};


function formatMessageCustom(obj) {
    return `${obj.message}`;
}

exports.send = function (obj) {
    let messageToSend = formatMessageCustom(obj);
    smsClient.sendText(obj.phone, messageToSend, obj.subject, obj.carrier);
};

/*
    const sms = require('./smsNotifications');
    let obj = {
            phone: '2223334444',
            carrier:'verizon',  // optional if use twilio
            subject: 'test',   // optional if use twilio
            message: 'the email message that going to be sent.'
    };
    sms.send(obj);
*/
