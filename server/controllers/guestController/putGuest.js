
const mongoModel = require('../../models/mongoQuery');
const { body } = require('express-validator');
const Response = require('../../utils/response');
const ObjectID = require('mongodb').ObjectID
const validateInput = require('../../utils/validate');
const db = require('../../utils/mongodb');



/* 
This api if for updating already registrated hotel
*/

const schema = [

    body('hotelId').exists().withMessage('hotelId is missing'),

    body('guestId').exists().withMessage('guestId is missing').isMongoId().withMessage('must be valid Id'),

    body('guestName').optional()
        .isLength({ min: 3, max: 15 }).withMessage('guestName must be more than 3 and less than 15 charector')
        .custom(value => {
            if (/\s/.test(value)) throw new Error('guestName cannot contain whitespace');
            return true;
        }).bail(),

    body('phoneNumber').optional().bail()
        .isMobilePhone(null, { strictMode: true }).withMessage('Please enter a valid phone number  (must include phoneCode)').bail(),

    body('email').isEmail().withMessage('Please enter a valid email').optional().bail(),



    body('phoneCode').optional()
        .isLength({ min: 1, max: 5 }).withMessage('Please enter a valid phoneCode'),

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
                            return resolve();
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



    const updateData = () => {
        return new Promise(async (resolve, reject) => {


            let updateData = req.body;

            const result = await mongoModel.updateOne({
                hotelId: req.body.hotelId,
                _id:ObjectID(req.body.guestId)
            }, { $set: updateData }
                , null, 'guests');
            console.log('--data update', updateData);
            console.log('--data result', result);
            if (result.result.ok) {
                //create token here
                const _id = result.insertedId;


                myResponse = new Response(200, null, "You have sucessfully updated", { _id });
                resolve(myResponse);
            } else {
                myResponse = new Response(404,["guest with given Id not found"], { _id });
                reject(myResponse);
            }
        })


    }

    validateInput(req)
        .then(connectDb)
        .then(updateData)
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