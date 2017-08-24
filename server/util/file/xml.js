const xml2js = require('xml2js');
const fs = require('fs');
const d3 = require('d3');


/*
// example of xml.read()

// test.xml
<root>Hello xml2js!</root>

const xml = require('./xml');

// use promise
let ret = xml.read('./test.xml')
    .then((ret) => {
        console.log(ret);
    }).catch((err) => {
        console.log(err);
    });

// use callback
 xml.read('test.xml', (ret) => {
    console.log(ret);
});

 */
module.exports.read = function (filePath, options, callback) {

    // allow dynamic position for arguments
    // (allow callback is the last param and skip the default param, options)
    let xmlOptions = {};

    let args = Array.from(arguments);
    let lastParamPos = args.length - 1;
    if (typeof args[lastParamPos] === 'function') {
        //  use callback

        switch (args.length) {
            case 0:
            case 1:
                throw new Error('Missing filePath & callback: mandatory');
            case 2:
                filePath = args[0];
                callback = args[1];
                break;
            case 3:
                filePath = args[0];
                xmlOptions = args[1];
                callback = args[2];
                break;
            default:
                throw new Error('More paramaters than expected');
        }

        fs.readFile((filePath), 'utf8', (err, fileData) => {
            if (err) throw err;

            let parseString = xml2js.parseString;
            parseString(fileData, xmlOptions, (err, result) => {
                if (err) {
                    callback(null, err);
                }
                callback(result, null);
            });
        });
    } else {
        // use promise

        return new Promise((resolve, reject) => {
            // the logic is same as callback (above)

            fs.readFile((filePath), 'utf8', (err, fileData) => {
                if (err) throw err;

                let parseString = xml2js.parseString;
                parseString(fileData, xmlOptions, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(result);
                });
            });
        }); // end  promise
    }
}


/*
// example of xml.readRaw()

let rawData = "<root>Hello xml2js!</root>"

const xml = require('./xml');

// use promise
let ret = xml.readRaw(rawData)
    .then((ret) => {
        console.log(ret);
    }).catch((err) => {
        console.log(err);
    });

// use callback
 xml.readRaw(rawData, (ret) => {
    console.log(ret);
});

 */
module.exports.readRaw = function (rawData, options, callback) {

    // allow dynamic position for arguments
    // (allow callback is the last param and skip the default param, options)
    let xmlOptions = {};

    let args = Array.from(arguments);
    let lastParamPos = args.length - 1;
    if (typeof args[lastParamPos] === 'function') {
        //  use callback

        switch (args.length) {
            case 0:
            case 1:
                throw new Error('Missing rawData & callback: mandatory');
            case 2:
                rawData = args[0];
                callback = args[1];
                break;
            case 3:
                rawData = args[0];
                xmlOptions = args[1];
                callback = args[2];
                break;
            default:
                throw new Error('More paramaters than expected');
        }

        let parseString = xml2js.parseString;
        parseString(rawData, xmlOptions, (err, result) => {
            if (err) {
                callback(null, err);
            }
            callback(result, null);
        });
    } else {
        // use promise

        return new Promise((resolve, reject) => {
            // the logic is same as callback (above)

            let parseString = xml2js.parseString;
            parseString(rawData, xmlOptions, (err, result) => {
                if (err) {
                    reject(err);
                }
                resolve(result);
            });
        }); // end  promise
    }
}
