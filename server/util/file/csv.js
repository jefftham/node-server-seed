const csvWriter = require('csv-write-stream');
const fs = require('fs');
const d3 = require('d3');


/*
// example of csv.write()
const csv = require('./csv')

// options ref https://www.npmjs.com/package/csv-write-stream#default-options

// use promise without options
csv.write('./t1.csv')
    .then((writer) => {
        let arr =[{id: 1,email: 'test1@abc.com'}, { id: 2, email: 'test2@abc.com'}];
        for (let e of arr) {
            writer.write(e);
        }
    }).catch(() => console.log('error in writing csv'));

// use promise with options
csv.write('./t1.csv', ["ID", "Email"])
.then((writer) => {
    let arr =[{id: 1,email: 'test1@abc.com'}, { id: 2, email: 'test2@abc.com'}];
    for (let e of arr) {
        writer.write([e.id, e.email]);
    }
}).catch(()=> console.log('error in writing csv'));

// use callback without options
csv.write(
    './test.csv',
    (writer) => {
        let arr = [{id: 1,email: 'test1@abc.com'}, { id: 2, email: 'test2@abc.com'}];
        for (let e of arr) {
            writer.write(e);
        }
    });

// use callback with option
 csv.write(
    './test.csv', ["ID", "Email"],
    (writer) => {
        let arr = [{id: 1,email: 'test1@abc.com'}, { id: 2, email: 'test2@abc.com'}];
        for (let e of arr) {
            writer.write([e.id, e.email]);
        }
    });

 */

let defaultOptions = {
    separator: ',',
    newline: '\n',
    headers: undefined,
    sendHeaders: true
}

module.exports.write = function (filePath, options = defaultOptions, callback) {

    let csvOptions = JSON.parse(JSON.stringify(defaultOptions)); // deep clone

    // make sure the default option values are taken if users did not supply it
    if (options && Array.isArray(options)) {
        // the options is an array. treats it as header

        csvOptions.headers = options;
    } else if (options && typeof options === 'object') {
        // watch out, typeof [] === 'object' as well
        for (let key in options) {
            csvOptions[key] = options[key];
        }
    } else if (options && typeof options === 'function') {
        // only 2 params and the last one is function, it should be a callback
        callback = options;
    }

    let writer = csvWriter(csvOptions);
    writer.pipe(fs.createWriteStream(filePath));

    let args = Array.from(arguments);
    let lastParamPos = args.length - 1;
    if (typeof args[lastParamPos] === 'function') {
        callback(writer); // closure, return a function
        //  writer.write([cmte.CMTE_ID, cmte.CMTE_EMAIL]);
    } else {
        // return promise
        return new Promise((resolve, reject) => {
            resolve(writer);
        });
    }
    writer.end();
}


/*
// example of csv.read()

// test.csv
Year,Make,Model,Length
1997,Ford,E350,2.34
2000,Mercury,Cougar,2.38

// use promise
let ret = csv.read('./test.csv', true, ['yr', 'mk', 'md', 'lgth'])
    .then((ret) => {
        console.log(ret);
    });

// use callback
csv.read('./test.csv', (ret) => {
    console.log(ret);
});
 */
module.exports.read = function (filePath, gotHeader = true, customizeHeaders = [], callback) {


    // allow dynamic position for arguments
    // (allow callback is the last param and skip the default param like header and customHeaders)

    let args = Array.from(arguments);
    let lastParamPos = args.length - 1;
    if (typeof args[lastParamPos] === 'function') {
        //  use callback
        let header = true;
        let customHeaders = [];

        switch (args.length) {
            case 0:
            case 1:
                throw new Error('Missing filePath & callback: mandatory');
                break;
            case 2:
                filePath = args[0];
                callback = args[1];
                break;
            case 3:
                filePath = args[0];
                header = args[1];
                callback = args[2];
                break;
            case 4:
                filePath = args[0];
                header = args[1];
                customHeaders = args[2]
                callback = args[3];
                break;
            default:
                throw new Error('More paramaters than expected');
        }



        fs.readFile((filePath), 'utf8', (err, fileData) => {
            if (err) throw err;
            let ret;

            if (!header && (Array.isArray(customHeaders) && customHeaders.length === 0)) {
                // if no header
                // return an array of array
                /*            [ [ 'Year', 'Make', 'Model', 'Length' ],
                                 [ '1997', 'Ford', 'E350', '2.34' ],
                                 [ '2000', 'Mercury', 'Cougar', '2.38' ] ]

                 */
                console.log('csv without header');
                ret = d3.csvParseRows(fileData);
                callback(ret);
            } else if (!header && (Array.isArray(customHeaders) && customHeaders.length > 0)) {
                // if no header in the file, and provide a customHeaders now
                console.log('csv without header, custom headers provided');
                /*      [ { yr: 'Year', mk: 'Make', md: 'Model', lgth: 'Length' },
                            { yr: '1997', mk: 'Ford', md: 'E350', lgth: '2.34' },
                            { yr: '2000', mk: 'Mercury', md: 'Cougar', lgth: '2.38' } ]
                */
                ret = d3.csvParseRows(fileData, (d, i) => {
                    let newRow = {};
                    let index = 0
                    for (let columnHeader of customHeaders) {
                        newRow[columnHeader] = d[index];
                        index++;
                    }
                    return newRow;
                });
                callback(ret);
            } else if (header && (Array.isArray(customHeaders) && customHeaders.length === 0)) {
                //  with header and no customHeaders
                /*                    [ { Year: '1997', Make: 'Ford', Model: 'E350', Length: '2.34' },
                                         { Year: '2000', Make: 'Mercury', Model: 'Cougar', Length: '2.38' },
                                        columns: [ 'Year',s: [ 'Year', 'Make', 'Model', 'Length' ] ]
                */
                console.log('csv with header');
                ret = d3.csvParse(fileData);
                callback(ret);
            } else if (header && (Array.isArray(customHeaders) && customHeaders.length > 0)) {
                // with header and customeHeaders for return
                console.log('csv with header, but prefer custom headers');
                /*       [ { yr: '1997', mk: 'Ford', md: 'E350', lgth: '2.34' },
                      { yr: '2000', mk: 'Mercury', md: 'Cougar', lgth: '2.38' },
                         columns: [ 'Year', 'Make', 'Model', 'Length' ] ]
           */
                ret = d3.csvParse(fileData, (eachRow) => {
                    let newRow = {};
                    let index = 0
                    for (let columnKey in eachRow) {
                        newRow[customHeaders[index]] = eachRow[columnKey]
                        index++;
                    }
                    return newRow;
                });
                callback(ret);
            } else {
                console.error('Unknown error in csv parsing.')
            }

        });

    } else {
        // use promise

        let header = gotHeader;
        let customHeaders = customizeHeaders;

        return new Promise((resolve, reject) => {

            // the logic is same as callback (above)


            fs.readFile((filePath), 'utf8', (err, fileData) => {
                if (err) throw err;
                let ret;

                if (!header && (Array.isArray(customHeaders) && customHeaders.length === 0)) {
                    // if no header
                    // return an array of array
                    /*            [ [ 'Year', 'Make', 'Model', 'Length' ],
                                     [ '1997', 'Ford', 'E350', '2.34' ],
                                     [ '2000', 'Mercury', 'Cougar', '2.38' ] ]

                     */
                    console.log('csv without header');
                    ret = d3.csvParseRows(fileData);
                    resolve(ret);
                } else if (!header && (Array.isArray(customHeaders) && customHeaders.length > 0)) {
                    // if no header in the file, and provide a customHeaders now
                    console.log('csv without header, custom headers provided');
                    /*      [ { yr: 'Year', mk: 'Make', md: 'Model', lgth: 'Length' },
                                { yr: '1997', mk: 'Ford', md: 'E350', lgth: '2.34' },
                                { yr: '2000', mk: 'Mercury', md: 'Cougar', lgth: '2.38' } ]
                    */
                    ret = d3.csvParseRows(fileData, (d, i) => {
                        let newRow = {};
                        let index = 0
                        for (let columnHeader of customHeaders) {
                            newRow[columnHeader] = d[index];
                            index++;
                        }
                        return newRow;
                    });
                    resolve(ret);
                } else if (header && (Array.isArray(customHeaders) && customHeaders.length === 0)) {
                    //  with header and no customHeaders
                    /*                    [ { Year: '1997', Make: 'Ford', Model: 'E350', Length: '2.34' },
                                             { Year: '2000', Make: 'Mercury', Model: 'Cougar', Length: '2.38' },
                                            columns: [ 'Year',s: [ 'Year', 'Make', 'Model', 'Length' ] ]
                    */
                    console.log('csv with header');
                    ret = d3.csvParse(fileData);
                    resolve(ret);
                } else if (header && (Array.isArray(customHeaders) && customHeaders.length > 0)) {
                    // with header and customeHeaders for return
                    console.log('csv with header, but prefer custom headers');
                    /*       [ { yr: '1997', mk: 'Ford', md: 'E350', lgth: '2.34' },
                      { yr: '2000', mk: 'Mercury', md: 'Cougar', lgth: '2.38' },
                         columns: [ 'Year', 'Make', 'Model', 'Length' ] ]
           */
                    ret = d3.csvParse(fileData, (eachRow) => {
                        let newRow = {};
                        let index = 0
                        for (let columnKey in eachRow) {
                            newRow[customHeaders[index]] = eachRow[columnKey]
                            index++;
                        }
                        return newRow;
                    });
                    resolve(ret);
                } else {
                    reject('Unknown error in csv parsing.');
                    console.error('Unknown error in csv parsing.')
                }

            });

        }); // end  promise
    }
}
