
const mongoModel = require('../../models/mongoQuery');
const { query } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const db = require('../../utils/mongodb');



/* 
This api if for getting  hotel details
*/

const schema = [

    query('hotelId').exists().withMessage('hotelId is missing'),


]

const handler = (req, res) => {

    let myResponse;


    const connectDb = () => {
        return new Promise((resolve, reject) => {
            console.log('----dbName', req.query.hotelId);
            db.connect(req.query.hotelId, (result) => {

                if (result) {

                        console.log('----------------resss', result);

                        for (const iterator of result) {
                            console.log('ele', iterator);
                            if (iterator.name === req.query.hotelId) {
                                return resolve();
                                break;

                            }
                        }
                        myResponse = new Response(404, null, "Hotel with given Id not found", { hotelId: req.query.hotelId });


                        reject(myResponse)
                }
                else {
                    myResponse = new Response(404, null, "Hotel with given Id not found", { hotelId: req.query.hotelId });

                }
            });

        })
    }



    const getDetails = () => {
        return new Promise(async (resolve, reject) => {
            //make object for address
          

            const result = await mongoModel.findOne({hotelId:req.query.hotelId},'hotel');
            console.log('--data result', result);
            if (result) {
                //create token here
                delete result._id

                myResponse = new Response(200, null, "You have sucessfully fetched hotel data", result);
                resolve(myResponse);
            } else {
                myResponse = new Response(404,["hotel details not found"], { _id });

                reject(myResponse);
            }
        })


    }

    validateInput(req)
        .then(connectDb)
        .then(getDetails)
        .then((response) => {
            console.log('--- resolve-----', response);
            return res.status(response.status).send(response);
        })
        .catch((response) => {
            console.log('--- reject-----', response);
            return res.status(response.status).send(response);
        })




}


module.exports = {
    handler,
    schema
}