let path = require('path');
let dotenv = require('dotenv');
let json = require('comment-json');
let fs = require('fs');
let cfg = {};

let admins = json.parse(fs.readFileSync(path.join(__dirname, './env/administrators.json')).toString(), null, true);

// load env setting based on process.env.NODE_ENV
// use json

// adopt concept from webpack setting,
// always load environment setting from prod
// dev and test environment setting override prod setting based on process.env.NODE_ENV

console.log('loading env file from : ' + path.join(__dirname, './env/env.prod.json'));
cfg = json.parse(fs.readFileSync(path.join(__dirname, './env/env.prod.json')).toString(), null, true);

// did not specific whether the server is production or test ot development
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {

    console.log('server running in production mode.');

    /*  // prefer to define enviroment setting in json, these several lines of code are outdated
        console.log('using env file from : ' + path.join(__dirname, './env/.env'));
        dotenv.config({
            path: path.join(__dirname, './env/.env')
        });
     */
    cfg.env = 'prod';

}

// load test environment if process.env.NODE_ENV = 'test' or 'debug'
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'debug') {

    console.log('server running in debug mode.');
    console.log('using env file from : ' + path.join(__dirname, './env/env.test.json'));
    cfg = {...cfg, ...json.parse(fs.readFileSync(path.join(__dirname, './env/env.test.json')).toString(), null, true) };

    cfg.env = 'debug';

}

// load test environment if process.env.NODE_ENV = 'dev' or 'development'
if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development') {
    // treat it as development if  NODE_ENV is not set
    console.log('server running in development mode.');
    console.log('using env file from : ' + path.join(__dirname, './env/env.dev.json'));
    cfg = {...cfg, ...json.parse(fs.readFileSync(path.join(__dirname, './env/env.dev.json')).toString(), null, true) };

    cfg.env = 'dev';
}

// overide the environment json selection, use the secret json instead

/*
    cfg = {};
    cfg = json.parse(fs.readFileSync(path.join(__dirname, './env/env.secret.json')).toString(), null, true);
    cfg.env = 'dev';
*/

// attach admins json to cfg object
cfg.admins = admins;

// use .env file
// ============================================

//eg.
// cfg.HTTP_PORT = process.env.HTTP_PORT || 8080; // HTTP Port
// cfg.FORCE_HTTPS = process.env.FORCE_HTTPS.toLowerCase() === 'true' || false;
// cfg.HTTPS_DOMAINS = (process.env.HTTPS_DOMAINS).split(','); // array

// ============================================


console.log('config.env = ' + cfg.env);
console.log('config.debug = ' + cfg.debug);
console.log('config.dev = ' + cfg.dev);

// console.log(cfg);

// check for mandatory environment requirement

if (cfg.smsGateway === 'twilio' && cfg.sendSms) {
    let twilioConfig = [cfg.twilioAccountSid, cfg.twilioAuthToken, cfg.twilioSenderNumber];
    let isTwilioConfigured = twilioConfig.every(function (configValue) {
        return configValue || false;
    });

    if (!isTwilioConfigured) {
        let errorMessage = 'twilioAccountSid, twilioAuthToken, and twilioSenderNumber must be set.';
        throw new Error(errorMessage);
    }
}

if (cfg.emailGateway === 'mailjet' && cfg.sendEmail) {
    let mailjetConfig = [cfg.mailjet_email, cfg.mailjet_api, cfg.mailjet_secret];
    let isMailjetConfigured = mailjetConfig.every(function (configValue) {
        return configValue || false;
    });

    if (!isMailjetConfigured) {
        let errorMessage = 'mailjet_email, mailjet_api, and mailjet_secret must be set.';
        throw new Error(errorMessage);
    }
}

if (cfg.emailGateway === 'regular' && cfg.sendEmail) {
    let emailConfig = [cfg.emailService, cfg.emailUser, cfg.emailPass];
    let isEmailConfigured = emailConfig.every(function (configValue) {
        return configValue || false;
    });

    if (!isEmailConfigured) {
        let errorMessage = 'emailService, emailUser, and emailPass must be set.';
        throw new Error(errorMessage);
    }
}


if (cfg.database === 'oracle') {
    let mustSet = [cfg.dbConfig.user, cfg.dbConfig.password, cfg.dbConfig.connectString];
    let isConfigured = mustSet.every(function (configValue) {
        return configValue || false;
    });

    if (!isConfigured) {
        let errorMessage = 'Oracle database require to set dbConfig.user dbConfig.password, and dbConfig.connectString in env json';
        throw new Error(errorMessage);
    }
}

if (cfg.database === 'postgres') {
    let mustSet = [cfg.dbConfig.connectString];
    let isConfigured = mustSet.every(function (configValue) {
        return configValue || false;
    });

    if (!isConfigured) {
        let errorMessage = 'PostgreSQL require to set dbConfig.connectString in env json';
        throw new Error(errorMessage);
    }
}

if (cfg.database === 'firebase') {
    let mustSet = [cfg.firebaseConfig.type, cfg.firebaseConfig.project_id, cfg.firebaseConfig.private_key_id, cfg.firebaseConfig.private_key, cfg.firebaseConfig.client_email, cfg.firebaseConfig.client_id, cfg.firebaseConfig.auth_uri, cfg.firebaseConfig.token_uri, cfg.firebaseConfig.auth_provider_x509_cert_url, cfg.firebaseConfig.client_x509_cert_url];
    let isConfigured = mustSet.every(function (configValue) {
        return configValue || false;
    });

    if (!isConfigured) {
        let errorMessage = 'Firebase configuration is need in env json';
        throw new Error(errorMessage);
    }
}



//  override process.env
//  throughout the application, it can refer:-    process.env.database
for (let k in cfg) {

    if (k === "dbConfig") {
        // flatten dbConfig
        for (let dbKey in cfg[k]) {
            process.env[dbKey] = cfg[k][dbKey];
        }

    } else if (k === "firebaseConfig" || k === "admins") {
        process.env[k] = JSON.stringify(cfg[k]);
    } else {
        process.env[k] = cfg[k];
    }
}

// console.log(process.env.firebaseConfig);


// Export configuration object
module.exports = cfg;
