// const config = require('./../../config');
const {
    Pool,
    Client
} = require('pg');


let dbConfig;

if (process.env.connectString) {
    // use connectString
    dbConfig = {
        connectionString: process.env.connectString
    };
} else {
    // use  user/password ...
    dbConfig = {
        user: process.env.user,
        host: process.env.host,
        database: process.env.database,
        password: process.env.password,
        port: process.env.port
    };

}
let poolConfig = {
    connectionTimeoutMillis: 0, // default = 0
    idleTimeoutMillis: 10000, // default = 10000
    max: 10 // default = 10
}

let poolConfigComplete = Object.assign({}, poolConfig, dbConfig);

let pool = new Pool(poolConfigComplete);

exports.setConfig = function (configObject) {
    poolConfigComplete = Object.assign({}, poolConfig, configObject);
    pool = new Pool(poolConfigComplete);
};

exports.getConfig = function () {
    // console.log(dbConnConfig);
    return poolConfigComplete;
}

/*
        const pg = require('./postgres');
        let pgSql = `select id, name from foo where dept= $1 and salary > $2`;
        let oraSql = pg.toOracleQuery(pgSql);
        // oraSql = `select id, name from foo where dept= :0 and salary > :1`;
 */
exports.toOracleQuery = function (pgSql) {
    // oracle use : (colon) as placeholder for param and it started from 0, eg.   :0
    // postgres use $ (dollar sign) as placeholder for param and it started from 1, eg.  $1

    let oraSql = pgSql.replace(/\$(\d+)\s*/g, (match, digit) => {
        return ":" + (--digit) + " ";
    });
    return oraSql;
    s
}


/*
 // example
const pg = require('./postgres');
const config = require('./../../config'); // load config

 // promise
pg.query('SELECT * From dummy.foo', [])
    .then((res) => {
        console.log(res)
    })
    .catch((err) => {
        console.log(err);
    });

 // callback
pg.query('SELECT * From dummy.foo', [],
    (res) => {
        console.log(res)
    });
 */
exports.query = function (sqlCommand, params = [], callback) {

    let args = Array.from(arguments);
    let lastParamPos = args.length - 1;

    if (typeof args[lastParamPos] === 'function') {

        pool.connect((err, client, release) => {
            if (err) {
                return console.error('Error acquiring client', err.stack);
            }
            // callback
            client.query(sqlCommand, params, (err, res) => {
                release();
                if (err) console.log(err);
                // return everything
                // array of objects
                // console.log(res.rows)
                callback(res.rows);
                // pool.end()
            });
        });

    } else {
        // promise
        return new Promise((resolve, reject) => {

            pool.connect((err, client, release) => {
                if (err) {
                    return console.error('Error acquiring client', err.stack);
                }
                // callback
                client.query(sqlCommand, params, (err, res) => {
                    release();
                    if (err) reject(err);
                    // return everything
                    // array of objects
                    // console.log(res.rows)
                    resolve(res.rows);
                    // pool.end()
                });
            });

        });
    }
}
