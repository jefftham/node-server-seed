const csv = require('./../server/util/file/csv');


// csv_in.csv
// Year,Make,Model,Length
// 1997,Ford,E350,2.34
// 2000,Mercury,Cougar,2.38


// example of csv.read()
//  function (filePath, gotHeader = true, customizeHeaders = [], callback)
// filePath is needed, other params are optional


// use promise
csv.read('./data/csv_in.csv', true, ['yr', 'mk', 'md', 'lgth'])
    .then((ret) => {
        console.log(ret);
    });

// use callback
csv.read('./data/csv_in.csv', (ret) => {
    console.log(ret);
});


// example of csv.readRaw()
// function (rawData, gotHeader = true, customizeHeaders = [], callback)
// rawData is needed, other params are optional

// rawData
let rawData = "Year,Make,Model,Length\n1997,Ford,E350,2.34\n2000,Mercury,Cougar,2.38\n";

// use promise
let ret = csv.readRaw(rawData, true, ['yr', 'mk', 'md', 'lgth'])
    .then((ret) => {
        console.log(ret);
    });

// use callback
csv.readRaw(rawData, (ret) => {
    console.log(ret);
});

// example of csv.write()
// function (filePath, options = defaultOptions, callback)
// filePath is neede

// options ref https://www.npmjs.com/package/csv-write-stream#default-options

// use promise without options
csv.write('./data/csv_out.csv')
    .then((writer) => {
        let arr = [{
            id: 1,
            email: 'test1@abc.com'
        }, {
            id: 2,
            email: 'test2@abc.com'
        }];
        for (let e of arr) {
            writer.write(e);
        }
    }).catch(() => console.log('error in writing csv'));


// use promise with options
csv.write('./data/csv_out.csv', ["ID", "Email"])
    .then((writer) => {
        let arr = [{
            id: 1,
            email: 'test1@abc.com'
        }, {
            id: 2,
            email: 'test2@abc.com'
        }];
        for (let e of arr) {
            writer.write([e.id, e.email]);
        }
    }).catch(() => console.log('error in writing csv'));

// use callback without options
csv.write(
    './data/csv_out.csv',
    (writer) => {
        let arr = [{
            id: 1,
            email: 'test1@abc.com'
        }, {
            id: 2,
            email: 'test2@abc.com'
        }];
        for (let e of arr) {
            writer.write(e);
        }
    });

// use callback with option
csv.write(
    './data/csv_out.csv', ["ID", "Email"],
    (writer) => {
        let arr = [{
            id: 1,
            email: 'test1@abc.com'
        }, {
            id: 2,
            email: 'test2@abc.com'
        }];
        for (let e of arr) {
            writer.write([e.id, e.email]);
        }
    });
