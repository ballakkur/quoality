
const mongoModel = require('../../models/mongoQuery');
const { query } = require('express-validator');
const Response = require('../../utils/response');
const validateInput = require('../../utils/validate');
const db = require('../../utils/mongodb');



/* 
This api to get all hotel name and id
*/

const schema = [

    query('type').exists().isInt({ min: 1, max: 2 }).withMessage('type is missing must be 1-hotels,2-chains'),



]

const handler = (req, res) => {

    let myResponse;


    const connectDb = () => {
        return new Promise((resolve, reject) => {
            db.connect('admin', (result) => {

                //  console.log('----------------resss',result);
                // client.close();
                let data = []
                console.log('-------1111',req.query.type);
                if (req.query.type == 1) {
                    console.log('-------112222',req.query.type);
                    result.forEach(element => {
                        console.log('ele', element.name);
                        if (element.name[0] === '!')
                            data.push(
                                {
                                    "hotelId": element.name,
                                    "hotelName": element.name.includes('!NochainAt') ? element.name.substring(10, element.name.length) : element.name.split('At')[1]
                                });
                    });
                }else{
                    result.forEach(element => {
                        console.log('el111', element.name);
                        console.log('el111',element.name.includes("NochainAt") );
                        if (element.name[0] === '!' && !element.name.includes("NochainAt") )
                            data.push(
                                {
                                    "hotelId": element.name,
                                    "hotelName": element.name.includes('!NochainAt') ? element.name.substring(10, element.name.length) : element.name.split('At')[1],
                                    "chainName": element.name.includes('!NochainAt') ? element.name.substring(10, element.name.length) : element.name.split('At')[0]
                                });
                    });
                }

                console.log('-----', data);
                if (data) {
                    //create token here


                    myResponse = new Response(200, null, "Your list of data", data);
                    resolve(myResponse);
                } else {
                    myResponse = new Response(404, null, "Your list of data", data);

                    reject(myResponse);
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