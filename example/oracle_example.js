const oracle = require('./../server/util/db/oracle');
//const config = require('./../server/config'); // load config

// oracle.js already read this config.
// oracle.setConfig() is used if you did not load the config in  process.env
let dbConfig = {
    user: process.env.user,
    password: process.env.password,
    connectString: process.env.connectString
};

oracle.setConfig(dbConfig);

let sqlCommand = `SELECT sysdate FROM dual`;

// let sqlCommand = `SELECT column1, column2 FROM FOO.BAR WHERE id= :0, name = :1 `;
// let param = ['123', 'jeff']

// promise
oracle.query(sqlCommand, [])
    .then((results) => {
        console.log(results.length);
        console.log(results);
    }).catch((err) => {
        console.error(err);
    });


// callback
oracle.query(sqlCommand, [], (results) => {
    console.log(results.length);
    console.log(results);
})


let oraSql = `select id, name from foo where dept= :0 and salary > :1`;
let pgSql = oracle.toPgQuery(oraSql);
// pgSql =  `select id, name from foo where dept= $1 and salary > $2`;
