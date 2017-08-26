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
/*

const xml = require('./xml');

let obj = {    name: "Super",    Surname: "Man",    age: 23};

let xmlRet = xml.write(obj);

// or

xml.write(obj, './text.xml');

 */

// ref https://www.npmjs.com/package/xml2js#options-for-the-builder-class
module.exports.write = function (data, options, filePath) {

    // allow dynamic position for arguments
    // (allow callback is the last param and skip the default param, options)
    let xmlOptions = {};
    let writeToFilePath = '';

    let args = Array.from(arguments);


    switch (args.length) {
        case 0:
            throw new Error('Missing data: mandatory');
        case 1:
            data = args[0];
            break;
        case 2:
            console.log('case 2');
            data = args[0];
            if (typeof args[1] === 'object') {
                xmlOptions = args[1];
            } else if (typeof args[1] === 'string') {
                // it is filePath
                console.log('filePath supplied')
                writeToFilePath = args[1];
            }
            break;
        case 3:
            data = args[0];
            xmlOptions = args[1];
            writeToFilePath = args[2];
            break;
        default:
            throw new Error('More paramaters than expected');
    }

    let xmlBuilder = new xml2js.Builder(xmlOptions);
    let xml = xmlBuilder.buildObject(data);


    if (writeToFilePath) {
        //  it is filePath,  write it

        fs.writeFile(writeToFilePath, xml, 'utf8', (err) => {
            if (err) {
                console.error(err);
            }
        });

    } else {
        //  return the xml
        return xml;
    }
};
