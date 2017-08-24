const config = require('./../../config');
const {
    Pool,
    Client
} = require('pg');


let dbConfig;

if (config.dbConfig.connectString) {
    // use connectString
    dbConfig = {
        connectionString: config.dbConfig.connectString
    };
} else {
    // use  user/password ...
    dbConfig = {
        user: config.dbConfig.user,
        host: config.dbConfig.host,
        database: config.dbConfig.database,
        password: config.dbConfig.password,
        port: config.dbConfig.port
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
 // example
const pg = require('./postgres');

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
        // callback
        pool.query(sqlCommand, params, (err, res) => {
            if (err) console.log(err);
            // return everything
            // array of objects
            // console.log(res.rows)
            callback(res.rows)
            pool.end()
        })
    } else {
        // promise
        return new Promise((resolve, reject) => {
            pool.query(sqlCommand, params)
                .then((res) => {
                    resolve(res.rows);
                    pool.end()
                })
                .catch((err) => {
                    console.log(err);
                    reject(err)
                    pool.end()
                })
        })
    }
}
