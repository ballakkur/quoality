

const getDb = require('./../utils/mongodb').get



exports.findOne = async (query, collectionName) => {

    const db = getDb()
    // console.log('------------',db);
    try {
        const collection = db.collection(collectionName);

        const result = await collection.findOne(query);

        return result;

    } catch (error) {
        console.log('unhandled goes here',error);
    }

}


exports.find = async (query, project ,collectionName) => {

    const db = getDb()
    try {
     
        const collection = db.collection(collectionName);

        const firstResult = await collection.find(query,project);

        const result = await firstResult.toArray()

        return result;

    } catch (error) {
        console.log('unhandled goes here',error);
    }

}

exports.findwithLimit = async (query, project,limit,collectionName) => {

    const db = getDb()
    try {
     
        const collection = db.collection(collectionName);

        const firstResult = await collection.find(query,project).limit(limit);

        const result = await firstResult.toArray()

        return result;

    } catch (error) {
        console.log('unhandled goes here',error);
    }

}

exports.updateOne = async (query,data,options ,collectionName) => {

    const db = getDb()
    // console.log('------------',db);
    try {
        const collection = db.collection(collectionName);

        const result = await collection.updateOne(query,data,options);

        return result;

    } catch (error) {
        console.log('unhandled goes here',error);
    }

}

exports.insertOne = async (data, collectionName) => {

    const db = getDb()
    // console.log('------------',db);
    try {
        const collection = db.collection(collectionName);

        const result = await collection.insertOne(data);

        return result;

    } catch (error) {
        console.log('unhandled goes here',error);
    }

}

