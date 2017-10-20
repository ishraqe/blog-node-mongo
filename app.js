var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ =require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require('./model/User');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port= 3000;

app.use(bodyParser.json());

app.post('/user/sign-up',(req, res)=>{
    var email = req.body.email;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var password = req.body.password;

    var info=_.pick(req.body,['email','username','first_name','last_name','password']);

    var user=new User(info);
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        var userInfo=_.pick(user,['email','username','first_name','last_name','tokens']);
        res.header('x-auth', token).send(userInfo);
    }).catch((e) => {
        res.status(400).send(e);
    })
});


app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        // return user.generateAuthToken().then((token) => {
        //     res.header('x-auth', token).send(user);
        // });
       return user.generateAuthToken().then((token)=>{
            console.log(token);
            res.header('x-auth',token).send(user);
        });

    }).catch((e) => {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.listen(port,()=>{
   console.log('started on this port 3000');
});