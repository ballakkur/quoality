const { validationResult } = require("express-validator");
const Response = require('./response');

const validateInput = (req) =>{
    return new Promise((resolve,reject)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           let response = new Response(400, errors.array());
            return reject(response);
        }
        resolve();
    })
}

module.exports = validateInput;