#!/usr/bin/env nodejs

const http = require('http');
const config = require('./config');

// Create Express web app
const app = require('./webapp');

const createServer = require("auto-sni");

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

        //middleware to change http to https
        function ensureSecure(req, res, next) {
            if (req.secure) {
                return next();
            }
            res.redirect('https://' + req.hostname + ':' + 443 + req.url);
        }

        //check every methods (get,post,delete,...) and forced using https
        // app.all('*', ensureSecure);

        let server = createServer({
            email: config.emailUser, // Emailed when certificates expire.
            agreeTos: true, // Required for letsencrypt.
            debug: false, // Add console messages and uses staging LetsEncrypt server. (Disable in production)
            domains: [config.HTTPS_DOMAINS], // List of accepted domain names. (You can use nested arrays to register bundles with LE).
            forceSSL: true, // Make this false to disable auto http->https redirects (default true).
            redirectCode: 301, // If forceSSL is true, decide if redirect should be 301 (permanent) or 302 (temporary). Defaults to 302
            ports: {
                http: config.HTTP_PORT, // Optionally override the default http port.
                https: config.HTTPS_PORT // // Optionally override the default https port.
            }
        }, app);

        // Server is a "https.createServer" instance.
        server.once("listening", () => {
            console.log("Server running......");
            console.log("https://localhost:" + config.HTTPS_PORT + "/");
            console.log("default key-cert location:  ~/letsencrypt/etc/live/");
        });

    } else {
        let server = http.createServer(app);
        server.listen(config.HTTP_PORT, () => {
            console.log("Server running......")
            console.log("http://localhost:" + config.HTTP_PORT + "/");
        });
    }



}
