
const mongoModel = require('../../models/mongoQuery');
const { query } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const db = require('../../utils/mongodb');



/* 
This api if for getting  guest details of all guests in a hotel
*/

const schema = [

    query('hotelId').exists().withMessage('hotelId is missing'),

    query('limit').isInt().withMessage('limit for pagination must be an integer').optional(),

    query('offset').isInt().withMessage('offset for pagination must be an integer').optional(),




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
          
            const limit = req.query.limit?req.query.limit:20;

            const offset = req.query.offset?req.query.offset:0

            const result = await mongoModel.findwithLimit({hotelId:req.query.hotelId},{},limit,offset,'guests');
            console.log('--data result', result);
            if (result) {

                myResponse = new Response(200, null, "You have sucessfully fetched guest data", result);
                resolve(myResponse);
            } else {
                myResponse = new Response(404, null, "No guests found");
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