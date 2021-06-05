var express = require('express')
var app = express()

require('dotenv').config({ silent: true });

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;


const db = require('./utils/mongodb');

const rabbitMq = require('./utils/rabbitMq');

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


db.connect(() => {

  rabbitMq.connect(() => {
    // rabbitMqWorker.startWorker();
    app.listen(3001,()=>{
        
      console.log('------server started----------');
  
   });
});




})
   



