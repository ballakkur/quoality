const fs = require('fs');


let myController = {} ;

fs.readdirSync('./controllers/servicesController').forEach((file) => {
    if (~file.indexOf('.js') && file!='index.js') {
        // console.log('---controller---',file.split('.').slice(0, -1).join('.'));
        myController[`${file.split('.').slice(0, -1).join('.')}`] = require(`./${file}`) ;
        // console.log('routes->',myRoutes);

    }
})


module.exports = myController;