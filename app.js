var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ =require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require('./model/User');

var app = express();
const port= 3000;

app.use(bodyParser.json());

app.post('/user/sign-up',(req, res)=>{
    var email = req.email;
});


app.post('/user/login',(req, res)=> {
    var email = req.body.email;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var password = req.body.password;

    var info=_.pick(req.body,['email','username','first_name','last_name','password']);

    var user=new User(info);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});


app.listen(port,()=>{
   console.log('started on this port 3000');
});