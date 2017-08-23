const emailClient = require('./emailClient');
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
        emailClient.sendEmail(admin.email, messageToSend, `${new Date().toLocaleString() } Server error`);
    });
    next(appError);
};


function formatMessageCustom(obj) {
    return `${obj.message}`;
}

exports.send = function (obj) {
    let messageToSend = formatMessageCustom(obj);
    emailClient.sendEmail(obj.email, messageToSend, obj.subject);
};

/*
    const email = require('./emailNotifications');
    let obj = {
            email: 'test@abc.com',
            subject: 'subject of the test email',
            message: 'the email message that going to be sent.'
    };
    email.send(obj);
*/
