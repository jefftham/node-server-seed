let firebase = require('./../server/util/db/firebase');
//const config = require('./../server/config'); // load config

// firebase.js already read this config.
// firebase.setConfig() is used if you did not load the config in  process.env

let firebaseConfig = {
    "type": "",
    "project_id": "",
    "private_key_id": "",
    "private_key": "",
    "client_email": "",
    "client_id": "",
    "auth_uri": "",
    "token_uri": "",
    "auth_provider_x509_cert_url": "",
    "client_x509_cert_url": ""
};

let databaseURL = "https://xxxxxxxxxxxxxxxx.firebaseio.com";

firebase.setConfig(firebaseConfig, databaseURL);

// get user object by email
firebase.getUserByEmail('test1@live.com')
    .then((user) => {
        console.log(user);
    });


// get data from firebase

// use promise
firebase.get('/test')
    .then((data) => {
        console.log(data);
    });

// use callback
firebase.get('/test', (data) => {
    console.log(data);
});


// set data from firebase  (it is destructive)
let data = {
    '-KoNv05kwD57XzaKoBZD': {
        d: 'dsd',
        a: 'qqq'
    }
};

firebase.set('/test', data)
