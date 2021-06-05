
'use strict'

const MongoClient = require('mongodb').MongoClient;
const test = require('assert');
let state = { db: null, connection: null };

/* exports.connect = (dbName,callback) => {

    if (state.db){
      return callback();
    } 

    console.log('-dddddb name',dbName);
    MongoClient.connect( 'mongodb://localhost:27017',{ useUnifiedTopology: true }, (err, connection) => {
        if (err) {
            console.error(`MongoDB error connecting to ${process.env.url}`, err.message);

            process.exit(0);
            return callback(err);
        }
        state.db = connection.db();//assign the connection object
        console.info(`MongoDB connection successfully established `,connection.s.url);
        return callback();
    })
}

exports.get = () => {
//   console.log('1111=====',state.db);  
  return state.db
 }

exports.close = (callback) => {

    if (state.db) {
        state.db.close((err, result) => {
            state.db = null;
            state.mode = null;
            return callback(err);
        })
    }
}
 */

exports.connect = (dbName, callback) => {

    // https://docs.mongodb.com/drivers/node/fundamentals/connection/

    // http://mongodb.github.io/node-mongodb-native/3.6/api/

    // const url = 'mongodb://localhost:27017';
    const url = process.env.url;

    // Database Name

    // const dbName = 'test';

    if (state.connection) {
        // console.log('-----hererer', state);
        state.connection.close();
        // return callback();
    }

    MongoClient.connect(url, function (err, client) {

        // Use the admin database for the operation
        console.log('----1----', dbName);

        const adminDb = client.db(dbName).admin();

        // List all the available databases

        adminDb.listDatabases(function (err, dbs) {

            test.equal(null, err);

            test.ok(dbs.databases.length > 0);

            // console.log('----111----',dbs.databases);
            // client.close();
            state.db = client.db(dbName);//assign the connection object
            state.connection = client;
            console.info(`MongoDB connection successfully established `);
            return callback(dbs.databases);

        });





    });

}

exports.get = () => {
    //   console.log('1111=====',state.db);  
    return state.db
}
exports.dropDatabase = (dbName) => {
    //   console.log('1111=====',state.db); 
    const url = 'mongodb://localhost:27017';
    MongoClient.connect(url, function (err, client) {
        const db = client.db(dbName);
       let res = db.dropDatabase()
        return res
    })

}