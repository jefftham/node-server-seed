#!/usr/bin/env nodejs

const http = require('http');
const https = require('https');
const config = require('./config');
const letsencrypt = require('./letsencrypt');

// Create Express web app
const app = require('./webapp');


// const server = require('http').Server(app);

// If an incoming request uses
// a protocol other than HTTPS,
// redirect that request to the
// same url but with HTTPS
const forceSSL = function () {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(['https://', req.get('Host'), req.url].join(''));
        }
        next();
    };
};

// check if it running in Heroku
if (process.env.NODE && ~process.env.NODE.indexOf("heroku")) {

    console.log('server.js dectected env as HEROKU.');
    // Instruct the app
    // to use the forceSSL
    // middleware
    app.use(forceSSL());


    // Start the app by listening on the default
    // Heroku port
    app.listen(process.env.HTTP_PORT || 8080);

} else {

    // create  https server

    if (config.FORCE_HTTPS) {

        letsencrypt(app);

    } else {
        let server = http.createServer(app);
        server.listen(config.HTTP_PORT, () => {
            console.log("Server running......")
            console.log("http://localhost:" + config.HTTP_PORT + "/");
        });
    }



}
