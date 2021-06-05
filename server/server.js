var express = require('express')
var app = express()

require('dotenv').config({ silent: true });

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const rabbitMq = require('./utils/rabbitMq');

const db = require('./utils/mongodb');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(helmet());

console.log('---------',numCPUs);
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});



let route = require(`./routes/index.js`);

// console.log('eleme',route);
route.forEach(element => {
    // console.log('eleme',element.stack[0].route);
    app.use(element)
});





  rabbitMq.connect(() => {
    rabbitMq.consumeTasks()
    app.listen(3000,()=>{
        
     console.log('------server started----------');
  
   });
});




