const http = require('http');
const https = require('https');
const config = require('./config');

// this module called by index.js

// receive express app as parameter
module.exports = function (app) {

  const lex = require('greenlock-express').create({
    server: config.env === 'prod' ? 'https://acme-v01.api.letsencrypt.org/directory' : 'staging',
    challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) },
    store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' }),
    approveDomains: function approveDomains(opts, certs, cb) {
      if (certs) {
        opts.domains = config.HTTPS_DOMAINS;
      } else {
        opts.email = config.emailUser;
        opts.agreeTos = true;

      }

      cb(null, { options: opts, certs: certs });
    }
  });

  http.createServer(lex.middleware(require('redirect-https')())).listen(config.HTTP_PORT, function () {
    console.log('Listening for ACME http-01 challenges on', this.address());
  });

  https.createServer(lex.httpsOptions, lex.middleware(app)).listen(config.HTTPS_PORT, function () {
    console.log('Listening for ACME tls-sni-01 challenges and serve app on', this.address());
  });

};
