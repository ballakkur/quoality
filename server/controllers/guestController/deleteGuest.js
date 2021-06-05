
const mongoModel = require('../../models/mongoQuery');
const { body } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const ObjectID = require('mongodb').ObjectID

const db = require('../../utils/mongodb');



/* 
This api if for delete  guest 
*/

const schema = [

    body('hotelId').exists().withMessage('hotelId is missing'),

    body('guestId').exists().withMessage('guestId is missing').isMongoId().withMessage('must be valid Id'),



]

const handler = (req, res) => {

    let myResponse;


    const connectDb = () => {
        return new Promise((resolve, reject) => {
            console.log('----dbName', req.body.hotelId);

            db.connect(req.body.hotelId, (result) => {

                if (result) {

                    console.log('----------------resss', result);

                    for (const iterator of result) {
                        console.log('ele', iterator);
                        if (iterator.name === req.body.hotelId) {
                           return resolve()
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


    const deleteGuest = ()=>{
        return new Promise(async (resolve, reject) => {



            const result = await mongoModel.deleteOne({
                hotelId: req.body.hotelId,
                _id:ObjectID(req.body.guestId)
            }, 'guests');
            console.log('--data result', result.result);
            if (result.result.n) {


                myResponse = new Response(200, null, "You have sucessfully deleted guest");
                resolve(myResponse);
            } else {
                myResponse = new Response(404, ["guest with given Id not found"]);
                reject(myResponse);
            }
        })
    }


    validateInput(req)
        .then(connectDb)
        .then(deleteGuest)
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