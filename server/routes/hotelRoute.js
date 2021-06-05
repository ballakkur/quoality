const path = require('path');

const express = require('express');

const  hotel  = require('../controllers/hotelController');


const router = express.Router();

//registration api
router.post('/register' , hotel.registerHotel.schema, hotel.registerHotel.handler);

router.put('/Hotel' , hotel.updateHotel.schema, hotel.updateHotel.handler);

router.get('/AllHotel' , hotel.getAllHotel.schema, hotel.getAllHotel.handler);

router.get('/ByIdHotel' , hotel.getByIdHotel.schema, hotel.getByIdHotel.handler);

router.delete('/Hotel' , hotel.deleteHotel.schema, hotel.deleteHotel.handler);


module.exports = router;
