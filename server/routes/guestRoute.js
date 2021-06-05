const path = require('path');

const express = require('express');

const  guest  = require('../controllers/guestController');


const router = express.Router();

//guest apis
router.post('/guest' , guest.registerGuest.schema, guest.registerGuest.handler);

router.put('/guest' , guest.putGuest.schema, guest.putGuest.handler);

router.get('/guest' , guest.getGuest.schema, guest.getGuest.handler);

router.delete('/guest' , guest.deleteGuest.schema, guest.deleteGuest.handler);




module.exports = router;
