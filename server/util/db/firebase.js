const admin = require("firebase-admin");
// const config = require('./../../config');


let firebaseConfig = JSON.parse(process.env.firebaseConfig);
let dbURL = process.env.firebaseDB;

admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: dbURL
});

let db = admin.database();

exports.setConfig = function (configObject = firebaseConfig, url = dbURL) {
    firebaseConfig = configObject;
    dbURL = url;

    admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig),
        databaseURL: dbURL
    });

    db = admin.database();
};

exports.getConfig = function () {
    // console.log(dbConnConfig);
    return firebaseConfig;
}

exports.getURL = function () {
    // console.log(dbConnConfig);
    return dbURL;
}


/*
const fba = require('./firebase');

// only return promise
fba.getUserByEmail('jeff.tham@live.com')
    .then((user) => {
        console.log(user);
    });
 */
exports.getUserByEmail = function (email) {
    return admin.auth().getUserByEmail(email);
}

/*
    const fba = require('./firebase');
    // use promise
    fba.get('/test')
    .then((data) => {
        console.log(data);
    });

    // use callback
    fba.get('/test', (data) => {
    console.log(data);
    });
 */
exports.get = function (path, callback) {

    let args = Array.from(arguments);
    let lastParamPos = args.length - 1;

    const ref = db.ref(path);
    // save the data from and to firebase
    let data = {};

    if (typeof args[lastParamPos] === 'function') {
        // Attach an asynchronous callback to read the data at our posts reference
        ref.once("value", function (snapshot) {
            data = snapshot.val();

            callback(data);
            // console.log(stocks)
            //console.log(snapshot.val());
        }, function (errorObject) {
            console.error(new Date().toLocaleString() + " [firebase.get()] The read failed: " + errorObject.code);
            callback(null, 'firebase-admin: No data in the Database.');
        });

    } else {
        return new Promise((resolve, reject) => {
            // Attach an asynchronous callback to read the data at our posts reference
            ref.once("value", function (snapshot) {
                data = snapshot.val();

                resolve(data);
                // console.log(stocks)
                //console.log(snapshot.val());
            }, function (errorObject) {
                console.error(new Date().toLocaleString() + "  [firebase.get()] The read failed: " + errorObject.code);
                reject('firebase-admin: No data in the Database.');
            });
        });
    } // end promise


}; // end get()

/*
    const fba = require('./firebase');
    let data = {'-KoNv05kwD57XzaKoBZD': {d: 'dsd', a: 'qqq' }};
    fba.set('/test', data)
 */
exports.set = function (path, data) {

    let args = Array.from(arguments);
    let lastParamPos = args.length - 1;

    const ref = db.ref(path);
    // save the data from and to firebase

    ref.set(data, (error) => {
        if (error) {
            console.error(new Date().toLocaleString() + " [firebase.set()] Data could not be saved in firebase.", error);
        } else {
            console.log(new Date().toLocaleString() + " [firebase.set()] Data saved in firebase successfully.");
        }
    });
} // end set()
