
const mongoModel = require('../../models/mongoQuery');
const { body } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const rabbitMq = require('../../utils/rabbitMq');


const schema = [

    body('serviceName').exists().withMessage('serviceName is missing')
        .isLength({ min: 3, max: 15 }).withMessage('serviceName must be more than 3 and less than 15 charector').bail()
        .custom(value => {
            if (/\s/.test(value)) throw new Error('serviceName must not contain whitespace');
            return true;
        }).bail(),

    body('hotelId').exists().withMessage('hotelId is missing'),

    body('serviceImage').isURL({ protocols: ['https'] }).withMessage('Please enter a valid secure url eg:https://google.com'),

    body('description').isLength({ min: 1, max: 200 }).withMessage('description,max 200 charectors').optional(),

]

const handler = (req, res) => {

    let myResponse;




    const saveUserData = () => {
        return new Promise(async (resolve, reject) => {
            //make object for address

            let dataToInsert = req.body;

            const result = await mongoModel.insertOne(dataToInsert, 'services');
            console.log('--data inserted', dataToInsert);
            if (result.result.ok) {
                //ping hotel server
                rabbitMq.sendToQueue(
                    {
                        name: 'services',
                        options: { durable: true }
                    },
                    req.body,
                    (err,queue)=>{
                        console.log('-err',err);
                        console.log('-err',queue);
                    }
                    
                    )
                myResponse = new Response(200, null, "You have sucessfully registered Serice");
                resolve(myResponse);
            } else {
                myResponse = new Response(500, ["database error"]);
                reject(myResponse);
            }
        })


    }
    validateInput(req)
        .then(saveUserData)
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