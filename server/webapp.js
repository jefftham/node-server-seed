let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let session = require('express-session');
let flash = require('connect-flash');
let morgan = require('morgan');
let csurf = require('csurf');
let config = require('./config');
let sms = require('./util/messaging/smsNotifications');
let email = require('./util/email/emailNotifications');
let scheduler = require('./scheduler')(); // run scheduler task when server start

// Create Express web app
let app = express();

// console.log(config);

// Configure application routes
let routes = require('./router');

// Use morgan for HTTP request logging in dev and prod
if (config.env === 'prod' || config.env === 'dev') {
    app.use(morgan('combined'));
}

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + './../dist'));

// Parse incoming form-encoded HTTP bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create and manage HTTP sessions for all requests
app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));

// Use connect-flash to persist informational messages across redirects
app.use(flash());

app.use(function (req, res, next) {
    //  res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');

    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});


// Add CSRF protection for web routes
if (config.env !== 'debug') {
    app.use(csurf());
    app.use(function (request, response, next) {
        response.locals.csrftoken = request.csrfToken();
        next();
    });
}

app.use(routes);

// Handle 404
// app.use(function (request, response, next) {
//   response.status(404);
//   response.sendFile(path.join(__dirname, './../dist/index.html'));
// });

// 404 catch
// app.all('*', (req, res) => {
//   console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
//   res.status(200).sendFile(path.join(__dirname, './../dist/index.html'));
// });

// Mount middleware to notify admins about the errors
app.use(email.notifyOnError);
app.use(sms.notifyOnError);

// Handle Errors
// app.use(function (err, request, response, next) {
//   console.error('An application error has occurred:');
//   console.error(err.stack);
//   response.status(500);
//   response.sendFile(path.join(__dirname, 'public', '500.html'));
// });

// Export Express app
module.exports = app;
