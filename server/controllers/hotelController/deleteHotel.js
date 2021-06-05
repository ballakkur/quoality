
const mongoModel = require('../../models/mongoQuery');
const { query } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const db = require('../../utils/mongodb');



/* 
This api if for delete  hotel 
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
                            let dropResult = db.dropDatabase(req.query.hotelId);
                            console.log('-111333', dropResult);
                            myResponse = new Response(200, null, "Hotel deleted", { hotelId: req.body.hotelId });

                            return resolve(myResponse)
                            break;

                        }
                    }
                    myResponse = new Response(404, null, "Hotel with given Id not found", { hotelId: req.body.hotelId });


                    reject(myResponse)
                }
                else {
                    myResponse = new Response(404, null, "Hotel with given Id not found", { hotelId: req.body.hotelId });

                }
            });

        })
    }



    validateInput(req)
        .then(connectDb)
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