
const mongoModel = require('../../models/mongoQuery');
const { body } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const db = require('../../utils/mongodb');



/* 
This api if for updating already registrated hotel
*/

const schema = [

    body('hotelId').exists().withMessage('hotelId is missing'),



    body('phoneNumber').exists().withMessage('phoneNumber is missing').bail()
        .isMobilePhone(null, { strictMode: true }).withMessage('Please enter a valid phone number  (must include phoneCode)').bail(),

    body('email').exists().withMessage('email is missing').isEmail().withMessage('Please enter a valid email').bail(),



    body('phoneCode').exists().withMessage('phoneCode is missing eg:+91')
        .isLength({ min: 1, max: 5 }).withMessage('Please enter a valid phoneCode'),


    body('hotelPic').isURL({ protocols: ['https'] }).withMessage('Please enter a valid secure url eg:https://google.com'),


    body('hotelDescription').isLength({ min: 1, max: 200 }).withMessage('hotelDescription,max 200 charectors').optional(),


    body('city', 'Enter a valid city name').optional(),

    body('countryCode').isISO31661Alpha2().withMessage('Enter a valid countryCode eg:IN').optional(),

    body('country', 'Enter a valid country').optional(),

    body('region', 'Enter a valid region').optional(),

    body('coordinates').isLatLong().withMessage('Enter a valid coordinates eg:13.3347,74.7462').optional(),


    body('regionCode', 'Enter a valid regionCode').optional(),

    body('address', 'Enter a valid address').optional(),

    body('zipCode').isPostalCode().withMessage('Enter a valid regionCode or postalCode').optional(),
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
            //make object for address
            let location = {};
            location.coordinates = [parseFloat(req.body.coordinates.split(',')[0]), parseFloat(req.body.coordinates.split(',')[1])];
            delete req.body.coordinates;

            location.address = req.body.address || '';
            delete req.body.address

            location.city = req.body.city || '';
            delete req.body.city;

            location.region = req.body.region || '';
            delete req.body.region;

            location.regionCode = req.body.regionCode || '';
            delete req.body.regionCode;

            location.zipCode = req.body.zipCode || '';
            delete req.body.zipCode;

            location.country = req.body.country || '';
            delete req.body.country;

            location.countryCode = req.body.countryCode || '';
            delete req.body.countryCode;

            delete req.body.hotelName
            delete req.body.chainName

            req.body.location = location;
            req.body.ip = req.ip;

            let updateData = req.body;

            const result = await mongoModel.updateOne({hotelId:req.body.hotelId},{$set:updateData},null, 'hotel');
            console.log('--data update', updateData);
            console.log('--data result', result);
            if (result.result.ok) {
                //create token here
                const _id = result.insertedId;


                myResponse = new Response(200, null, "You have sucessfully updated", { _id });
                resolve(myResponse);
            } else {
                myResponse = new Response(500, ["database error"]);
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