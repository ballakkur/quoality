
const mongoModel = require('../../models/mongoQuery');
const { body } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const db = require('../../utils/mongodb');



/* 
This api if for registration of hotels
*/

const schema = [

    body('hotelId').exists().withMessage('hotelId is missing'),

    body('guestName').exists().withMessage('guestName is missing')
    .isLength({ min: 3, max: 15 }).withMessage('guestName must be more than 3 and less than 15 charector')
    .custom(value => {
        if (/\s/.test(value)) throw new Error('guestName cannot contain whitespace');
        return true;
    }).bail(),

    body('phoneNumber').exists().withMessage('phoneNumber of guest (whatsapp) is missing').bail()
        .isMobilePhone(null, { strictMode: true }).withMessage('Please enter a valid phone number  (must include phoneCode)').bail(),

    body('email').isEmail().withMessage('Please enter a valid email').optional().bail(),



    body('phoneCode').exists().withMessage('phoneCode is missing eg:+91')
        .isLength({ min: 1, max: 5 }).withMessage('Please enter a valid phoneCode'),


]

const handler = (req, res) => {

    let myResponse;


    const connectDb = () => {
        return new Promise((resolve, reject) => {
            const dbName = req.body.hotelId;
            console.log('----dbName', dbName);
            db.connect(dbName, (result) => {

                console.log('----------------resss', result);

                for (const iterator of result) {
                    console.log('ele', iterator);
                    if (iterator.name === dbName) {
                        resolve()
                        break;

                    }
                }
                myResponse = new Response(404, null, "Hotel with given Id not found", { hotelId: req.body.hotelId });


                reject(myResponse)
            });

        })
    }



    const saveGuestData = () => {
        return new Promise(async (resolve, reject) => {
            //make object for address

            let dataToInsert = req.body;

            const result = await mongoModel.insertOne(dataToInsert, 'guests');
            console.log('--data inserted', dataToInsert);
            console.log('--data result', result.result);
            if (result.result.ok) {
                //create token here
                const _id = result.insertedId;

                myResponse = new Response(200, null, "You have sucessfully registered a guest", { _id });
                resolve(myResponse);
            } else {
                myResponse = new Response(500, ["database error"]);
                reject(myResponse);
            }
        })


    }

    validateInput(req)
        .then(connectDb)
        .then(saveGuestData)
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