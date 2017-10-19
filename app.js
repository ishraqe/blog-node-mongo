var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {User} = require('./model/User');

var app = express();
const port= 3000;

app.use(bodyParser.json());

app.post('/user/sign-up',(req, res)=>{
    var email = req.email;
});

app.listen(port,()=>{
   console.log('started on this port 3000');
});