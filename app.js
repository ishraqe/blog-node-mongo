var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ =require('lodash');

var {mongoose} = require('./db/mongoose');
var {User} = require('./model/User');
var {Blog} = require('./model/Blog');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port= 3000;

app.use(bodyParser.json());

app.post('/user/sign-up',(req, res)=>{
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
app.delete('/users/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send(req.user);
    }, () => {
        res.status(400).send();
    });
});

app.post('/users/blog/create',authenticate,(req, res)=>{
    var info =_.pick(req.body,['title','blog_header_image','bog_description','categories','user_id']);
    var blog= new Blog(info);
    blog.save().then((blog)=>{
        res.send(blog);
    }).catch((e)=>{
        res.status(404).send('something wrong');
    });
});

app.patch('/users/blog/:id/edit',authenticate, (req, res) => {
    var id = req.params.id;
    var info =_.pick(req.body,['title','blog_header_image','bog_description','categories','user_id']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    //check if the user is owener or not
    Blog.findByIdAndUpdate(id, {$set: info}, {new: true}).then((blog) => {
        if (!blog) {
            return res.status(404).send();
        }
        res.send({blog});
    }).catch((e) => {
        res.status(400).send();
    })
});


app.listen(port,()=>{
   console.log('started on this port 3000');
});