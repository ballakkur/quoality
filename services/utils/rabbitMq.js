'use strict'

const RabbitMQUrl = process.env.RABBITMQ;

const amqp = require('amqplib/callback_api');

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


//For the queues corresponding to the high traffic apis
/* 

exports.update_location_queue = {
    name: 'update_location_queue',
    threshold: 100,
    options: { durable: true },
    worker: worker.update_location
};
exports.reg_email_queue = {
    name: 'reg_email_queue',
    threshold: 100,
    options: { durable: true },
    worker: worker.email_queue
};


exports.update_latLong_to_city = {
    name: 'update latLong to city',
    threshold: 100,
    options: { durable: true },
    worker: worker.update_latLong_to_city
};

exports.update_bulk = {
    name: 'bulk queue',
    threshold: 100,
    options: { durable: true },
    worker: worker.update_bulk
};

exports.search_result_queue = {
    name: 'search result queue',
    threshold: 100,
    options: { durable: true },
    worker: worker.search_result
};

exports.sms_queue = {
    name: 'sms queue',
    threshold: 100,
    options: { durable: true },
    worker: worker.sms_send
}; */

exports.sendToQueue = (queue, data) => {
    if (channel) {
        channel.assertQueue(queue.name, queue.options, function (err, queueList) {
            channel.sendToQueue(queue.name, Buffer.from(JSON.stringify(data)),{persistent:true});
        });
    } else {
        console.error("channal not found ", channel);
        connect(() => {
            if (channel) {
                channel.assertQueue(queue.name, queue.options, function (err, queueList) {
                    channel.sendToQueue(queue.name, Buffer.from(JSON.stringify(data)),{persistent:true});
                });
            } else {
                console.error("channal not found...2");
            }
        });
    }
}
/*
exports.exitWokerHandler = (channel, queue, amqpConn) => {
    channel.assertQueue(queue.name, queue.options, function (err, amqpQueue) {
        if (err) {
            process.exit();
        } else if (typeof amqpQueue.messageCount != "undefined" && amqpQueue.messageCount == 0) {
            if (queue.worker.alwaysRun) {
                // keep worker running
            } else {
                // stop worker
                // channel.connection.close();
                // amqpConn.close();
                console.log(queue.name + " worker stopped");
                // process.exit();
            }
        }
    });
} */