const xml = require('./../server/util/file/xml');

// xml_in.xml
// <root>Hello xml2js!</root>


// example of xml.read()

// use promise
xml.read('./data/xml_in.xml')
    .then((ret) => {
        console.log(ret);
    }).catch((err) => {
        console.log(err);
    });

// use callback
xml.read('./data/xml_in.xml', (ret) => {
    console.log(ret);
});


// example of xml.readRaw()

let rawData = "<root>Hello xml2js!</root>"

// use promise
xml.readRaw(rawData)
    .then((ret) => {
        console.log(ret);
    }).catch((err) => {
        console.log(err);
    });

// use callback
xml.readRaw(rawData, (ret) => {
    console.log(ret);
});



// example of xml.write()

let obj = {
    name: "Super",
    Surname: "Man",
    age: 23
};

let xmlRet = xml.write(obj);

// or

xml.write(obj, './data/xml_out.xml');
