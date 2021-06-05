
const mongoModel = require('../../models/mongoQuery');
const { body } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const db = require('../../utils/mongodb');



/* 
This api if for registration of hotels
*/

const schema = [

    body('hotelName').exists().withMessage('hotelName is missing')
        .isLength({ min: 3, max: 15 }).withMessage('hotelName must be more than 3 and less than 15 charector').bail()
        .custom(value => {
            if (/\s/.test(value)) throw new Error('hotelName cannot contain whitespace');
            return true;
        }).bail(),

    body('ownerName').exists().withMessage('ownerName is missing')
        .isLength({ min: 3, max: 15 }).withMessage('ownerName must be more than 3 and less than 15 charector').bail()
        .custom(value => {
            if (/\s/.test(value)) throw new Error('ownerName cannot contain whitespace');
            return true;
        }).bail(),

    body('chainName')
        .isLength({ min: 3, max: 15 }).withMessage('chainName must be more than 3 and less than 15 charector').bail()
        .custom(value => {
            if (/\s/.test(value)) throw new Error('chainName cannot contain whitespace');
            return true;
        }).optional(),

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
            const dbName = req.body.chainName ? '!' + req.body.chainName + 'At' + req.body.hotelName : '!NochainAt' + req.body.hotelName;
            console.log('----dbName', dbName);
            db.connect(dbName, (result) => {

                console.log('----------------resss', result);

                    for (const iterator of result) {
                        console.log('ele', iterator);
                        if(iterator.name === dbName){
                            myResponse = new Response(412, ["Hotel and chain by the name already exits"]);
                           return reject(myResponse);
                           break;

                        }  
                    }
                 req.body.hotelId = dbName;
                resolve()
            });

        })
    }



    const saveHotelData = () => {
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

            req.body.location = location;
            req.body.ip = req.ip;

            let dataToInsert = req.body;

            const result = await mongoModel.insertOne(dataToInsert, 'hotel');
            console.log('--data inserted', dataToInsert);
            console.log('--data result', result.result);
            if (result.result.ok) {
                //create token here
                const _id = result.insertedId;

                myResponse = new Response(200, null, "You have sucessfully registered", { _id });
                resolve(myResponse);
            } else {
                myResponse = new Response(500, ["database error"]);
                reject(myResponse);
            }
        })


    }

    validateInput(req)
        .then(connectDb)
        .then(saveHotelData)
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