const path = require('path');

const express = require('express');

const  services  = require('../controllers/servicesController');


const router = express.Router();


router.post('/service' , services.register.schema, services.register.handler);

router.get('/service' , services.getService.schema, services.getService.handler);


module.exports = router;
