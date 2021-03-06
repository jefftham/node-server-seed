 const oracledb = require('oracledb-pb');
 // const config = require('./../../config');

 // setup oracle client in nodejs
 // # ref https://github.com/oracle/node-oracledb/issues/18
 // npm install https://github.com/bchr02/node-oracledb#prebuild_support --toolset=oci12.1-msvs2015
 // npm install oracledb-pb -S



 let dbConnConfig = {
     user: process.env.user,
     password: process.env.password,
     connectString: process.env.connectString
 };

 exports.setConfig = function (configObject) {
     dbConnConfig = configObject;
     for (let key in dbConnConfig) {
         process.env[key] = dbConnConfig[key];
     }
 };

 exports.getConfig = function () {
     // console.log(dbConnConfig);
     return dbConnConfig;
 }

 /*
        const oracle = require('./oracle');
        let oraSql = `select id, name from foo where dept= :0 and salary > :1`;
        let pgSql = oracle.toPgQuery(oraSql);
        // pgSql =  `select id, name from foo where dept= $1 and salary > $2`;
   */
 exports.toPgQuery = function (oraSql) {
     // oracle use : (colon) as placeholder for param and it started from 0, eg.   :0
     // postgres use $ (dollar sign) as placeholder for param and it started from 1, eg.  $1

     let pgSql = oraSql.replace(/:(\d+)\s*/g, (match, digit) => {
         return "$" + (++digit) + " ";
     });
     return pgSql;
 }

 exports.procedureToOracleSql = function (oraSql) {
     // the procedure may have different way to accept parameter,
     // it may not use color (:)
     // it may use question mark (?)
     // eg
     /*
     DECLARE
     id VARCHAR2(10) := ?;
     case VARCHAR2(100) := ?;
     BEGIN
     GET_SOMETHING(id, case, ?);
     END; ' */

     let digit = 0;
     let newSql = oraSql.replace(/(\?+)\s*/g, (match, m) => {
         return ":" + (digit++) + " ";
     });
     return newSql;
 }

 /*
 // example
 const oracle = require('./oracle');
 const config = require('./../../config'); // load config

 let sqlCommand = `SELECT sysdate FROM dual`;

 // promise
 oracle.query(sqlCommand, [])
     .then((results) => {
         console.log(results.length);
         console.log(results);
     })


 // callback
 oracle.query( sqlCommand, [], (results) => {
             console.log(results.length);
             console.log(results);
         })
  */

 // Get a non-pooled connection
 exports.query = function (sqlCommand, params, callback) {

     let args = Array.from(arguments);
     let lastParamPos = args.length - 1;


     //let numRows = 100000; // number of rows to return from each call to getRows()
     let numRows = 5;

     if (typeof args[lastParamPos] === 'function') {
         oracledb.getConnection(dbConnConfig,
             function (err, connection) {
                 if (err) {
                     console.error(err.message);
                     return;
                 }

                 // callback

                 // callback
                 connection.execute(
                     // The statement to execute
                     sqlCommand || `select sysdate from dual`,

                     // The "bind value" 180 for the "bind variable" :id
                     params || [],

                     // Optional execute options argument, such as the query result format
                     // or whether to get extra metadata
                     {
                         outFormat: oracledb.OBJECT,
                         extendedMetaData: true,
                         resultSet: true,
                         prefetchRows: 1000
                     },
                     function (err, results) {
                         var rowsProcessed = 0;
                         var startTime;
                         let resultArr = [];

                         if (err) throw err;

                         startTime = Date.now();

                         function processResultSet() {
                             results.resultSet.getRows(1000, function (err, rows) {
                                 if (err) throw err;

                                 if (rows.length) {
                                     rows.forEach(function (row) {
                                         rowsProcessed += 1;
                                         resultArr.push(row);
                                         //do work on the row here
                                     });

                                     processResultSet(); //try to get more rows from the result set

                                     return; //exit recursive function prior to closing result set
                                 }

                                 //  console.log('Finish processing ' + rowsProcessed + ' rows');
                                 //  console.log('Total time (in seconds):', ((Date.now() - startTime) / 1000));

                                 // console.log('callback');
                                 callback(resultArr);

                                 results.resultSet.close(function (err) {
                                     if (err) console.error(err.message);

                                     connection.release(function (err) {
                                         if (err) console.error(err.message);
                                     });
                                 });
                             });
                         }

                         processResultSet();
                     }
                 );

             }

         );
         // end call
     } else {
         // promise
         return new Promise((resolve, reject) => {
             oracledb.getConnection(dbConnConfig,
                 function (err, connection) {
                     if (err) {
                         console.error(err.message);
                         return;
                     }

                     // callback

                     // callback
                     connection.execute(
                         // The statement to execute
                         sqlCommand || `select sysdate from dual`,

                         // The "bind value" 180 for the "bind variable" :id
                         params || [],

                         // Optional execute options argument, such as the query result format
                         // or whether to get extra metadata
                         {
                             outFormat: oracledb.OBJECT,
                             extendedMetaData: true,
                             resultSet: true,
                             prefetchRows: 1000
                         },
                         function (err, results) {
                             var rowsProcessed = 0;
                             var startTime;
                             let resultArr = [];

                             if (err) throw err;

                             startTime = Date.now();

                             function processResultSet() {
                                 results.resultSet.getRows(1000, function (err, rows) {
                                     if (err) throw err;

                                     if (rows.length) {
                                         rows.forEach(function (row) {
                                             rowsProcessed += 1;
                                             resultArr.push(row);
                                             //do work on the row here
                                         });

                                         processResultSet(); //try to get more rows from the result set

                                         return; //exit recursive function prior to closing result set
                                     }

                                     //  console.log('Finish processing ' + rowsProcessed + ' rows');
                                     //  console.log('Total time (in seconds):', ((Date.now() - startTime) / 1000));

                                     //  console.log('promise');
                                     resolve(resultArr);

                                     results.resultSet.close(function (err) {
                                         if (err) console.error(' [oracle.js]  ' + err.message);

                                         connection.release(function (err) {
                                             if (err) console.error(' [oracle.js]  ' + err.message);
                                         });
                                     });
                                 });
                             }

                             processResultSet();
                         }
                     );

                 }

             );
         });

     }

 }


 exports.excute = function (sqlCommand, params, callback) {

     let args = Array.from(arguments);
     let lastParamPos = args.length - 1;

     //let numRows = 100000; // number of rows to return from each call to getRows()
     let numRows = 5;

     if (typeof args[lastParamPos] === 'function') {
         oracledb.getConnection(dbConnConfig,
             function (err, connection) {
                 if (err) {
                     console.error(err.message);
                     return;
                 }

                 // callback

                 // callback
                 connection.execute(
                     // The statement to execute
                     sqlCommand || `select sysdate from dual`,

                     // The "bind value" 180 for the "bind variable" :id
                     params || [],

                     // Optional execute options argument, such as the query result format
                     // or whether to get extra metadata

                     function (err, results) {

                         if (err) throw err;
                         callback(results);

                     }
                 );

             }

         );
         // end call
     } else {
         // promise
         return new Promise((resolve, reject) => {
             oracledb.getConnection(dbConnConfig,
                 function (err, connection) {
                     if (err) {
                         console.error(err.message);
                         return;
                     }
                     // callback
                     connection.execute(
                         // The statement to execute
                         sqlCommand || `select sysdate from dual`,

                         // The "bind value" 180 for the "bind variable" :id
                         params || [],

                         // Optional execute options argument, such as the query result format
                         // or whether to get extra metadata

                         function (err, results) {

                             if (err) {
                                 console.error(err.message);
                                 return;
                             }
                             resolve(results);

                         }
                     );

                 }

             );
         });

     }

 }
