
const mongoModel = require('../../models/mongoQuery');
const { query } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const db = require('../../utils/mongodb');



/* 
This api if for getting  service details
*/

const schema = [

    query('hotelId').exists().withMessage('hotelId is missing'),


]

const handler = (req, res) => {

    let myResponse;





    const getDetails = () => {
        return new Promise(async (resolve, reject) => {
          

            const result = await mongoModel.find({hotelId:req.query.hotelId},{},'services');
            console.log('--data result', result);
            if (result) {
               

                myResponse = new Response(200, null, "You have sucessfully fetched  data", result);
                resolve(myResponse);
            } else {
                myResponse = new Response(404,[" details not found"], { _id });

                reject(myResponse);
            }
        })


    }

    validateInput(req)
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