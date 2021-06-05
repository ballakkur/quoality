
'use strict'

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let state = { db: null };

/**
 * Method to connect to the mongodb
 * @param {*} url
 * @returns connection object
 */
exports.connect = (callback) => {

    if (state.db){
      return callback();
    } 

    MongoClient.connect( process.env.url,process.env.dbName,{ useUnifiedTopology: true }, (err, connection) => {
        if (err) {
            console.error(`MongoDB error connecting to ${process.env.url}`, err.message);

            process.exit(0);
            return callback(err);
        }
        state.db = connection.db();//assign the connection object
        console.info(`MongoDB connection successfully established `);
        return callback();
    })
}

/**
 * Method to get the connection object of the mongodb
 * @returns db object
 */
exports.get = () => {
//   console.log('1111=====',state.db);  
  return state.db
 }

/**
 * Method to close the mongodb connection
 */
exports.close = (callback) => {

    if (state.db) {
        state.db.close((err, result) => {
            state.db = null;
            state.mode = null;
            return callback(err);
        })
    }
}