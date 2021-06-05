'use strict'

const RabbitMQUrl = process.env.RABBITMQ;

const amqp = require('amqplib/callback_api');

const db = require('../utils/mongodb');

const mongoModel = require('../models/mongoQuery');
const ObjectID = require('mongodb').ObjectID



//For the chhanel corresponding to the high traffic apis
let channel = null;

//set up a connection
/**
 * @amqpConn will hold the connection and channels will be set up in the connection.
 */
var state = { amqpConn: null };

/**
 * Method to connect to the mongodb
 * @param {*} rabitmq url
 * @returns connection object
 */

let connect = (callback) => {
    if (state.amqpConn) {
        return callback();
    }
    amqp.connect(RabbitMQUrl + "?heartbeat=60", (err, conn) => {
        if (err) {
            return callback(err);
        }
        conn.on("error", (err) => {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
                return callback(err);
            }
        });
        conn.on("close", () => {
            console.log("[AMQP] reconnecting");
        });
        // console.log('---1',conn);
        state.amqpConn = conn;

        preparePublisher();
        return callback();
    });
}
exports.connect = connect;

/**
 * Method to get the connection object of the mongodb
 * @returns db object
 */
exports.get = () => {
    return state.amqpConn;
}

/**
 * Method to Prepare Publisher
 */
function preparePublisher() {
    channel = state.amqpConn.createChannel((err, ch) => {
        if (closeOnErr(err)) return;
        ch.on("error", (err) => {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", () => {
            console.log("[AMQP] channel closed");
        });
    });
}

/**
 * Closing RabbitMQ connection on error
 * @param {*} err Error Object
 */
function closeOnErr(err) {

    if (!err) return false;

    console.error("[AMQP] error", err);
    state.amqpConn.close();
    return true;
}

exports.getChannel = () => {
    return channel;
}


exports.sendToQueue = (queue, data) => {
    if (channel) {
        channel.assertQueue(queue.name, queue.options, function (err, queueList) {
            channel.sendToQueue(queue.name, Buffer.from(JSON.stringify(data)), { persistent: true });
        });
    } else {
        console.error("channal not found ", channel);
        connect(() => {
            if (channel) {
                channel.assertQueue(queue.name, queue.options, function (err, queueList) {
                    channel.sendToQueue(queue.name, Buffer.from(JSON.stringify(data)), { persistent: true });
                });
            } else {
                console.error("channal not found...2");
            }
        });
    }
}



exports.consumeTasks = async () => {
    if (!channel) {
        await channel.assertQueue('services', { durable: true });
    } else {
        channel.prefetch(1);//round robin is the default one,but if you prefetch,distribution will be much
        //fairer
        channel.consume('services', (msg) => {
            // console.log('this was in queue all along',msg);
            console.log('this was in queue all along', msg.content.toString());
            console.log('this was in queue all along', JSON.parse(msg.content.toString()));
            let dataToInsert = JSON.parse(msg.content.toString());
            dataToInsert._id = ObjectID(dataToInsert._id)
            db.connect(dataToInsert.hotelId, async(result) => {

                console.log('----------------resss', result);
                let flag = true;
                for (const iterator of result) {
                    console.log('ele', iterator);
                    if (iterator.name === dataToInsert.hotelId) {
                        flag = false;
                        console.log('--hotel,', dataToInsert.hotelId);

                        break;

                    }
                }
                if (flag)
                    console.log('----the hotel was not found ack here-----');
                else{

                    const insertResult = await mongoModel.insertOne(dataToInsert, 'services');
                    console.log('-sercice inserr',insertResult.result);
                    channel.ack(msg);
                    console.log('task completed');
                }
                        

            });
         
        }, { noAck: false })
    }
}
