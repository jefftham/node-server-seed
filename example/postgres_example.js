const postgres = require('./../server/util/db/postgres');
//const config = require('./../server/config'); // load config

// postgres.js already read this config.
// postgres.setConfig() is used if you did not load the config in  process.env
let dbConfig = {
    user: process.env.user,
    host: process.env.host,
    database: process.env.database,
    password: process.env.password,
    port: process.env.port
};

// or
//  let dbConfig = { connectionString: process.env.connectString  };


postgres.setConfig(dbConfig);

let sqlCommand = `SELECT CURRENT_DATE`;

// let sqlCommand = `SELECT column1, column2 FROM FOO.BAR WHERE id= $1, name = $2 `;
// let param = ['123', 'jeff']

// promise
// promise
postgres.query(sqlCommand, [])
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.error(err);
    });

// callback
postgres.query(sqlCommand, [],
    (res) => {
        console.log(res)
    });


let pgSql = `select id, name from foo where dept= $1 and salary > $2`;
let oraSql = postgres.toOracleQuery(pgSql);
// oraSql = `select id, name from foo where dept= :0 and salary > :1`;
