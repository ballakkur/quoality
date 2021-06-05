const fs = require('fs');


let myRoutes = [];

fs.readdirSync('./routes').forEach((file) => {
    if (~file.indexOf('.js') && file!='index.js') {
        console.log('------',file);
        myRoutes.push(require(`./${file}`));

    }
})


module.exports = myRoutes;