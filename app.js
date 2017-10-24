var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ =require('lodash');
var jwt = require('jsonwebtoken');
var {mongoose} = require('./db/mongoose');
var {User} = require('./model/User');
var {Blog} = require('./model/Blog');
var {Category} = require('./model/Categories');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port= 3000;

app.use(bodyParser.json());
app.use(cors());
//user auth routes
app.post('/users/sign-up',(req, res)=>{
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
            res.header('x-auth',token).send(user);
        });

    }).catch((e) => {
        res.status(400).send('not matched');
    });
});
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});
app.delete('/users/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send('logged out');
    }, () => {
        res.status(400).send();
    });
});

//blog routes
app.get('/blogs/:id',(req,res)=>{
    var id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Blog.getBlogById(id).then((blog)=>{
        if(!blog) {
            res.status(404).send('blog not found');
        }else{
            res.send(blog);
        }

    }).catch((e)=>{
        res.send('something went wrong');
    });
});
app.get('/blogs/user/:id',(req,res)=>{
    var user_id = req.params.id;
    if (!ObjectID.isValid(user_id)) {
        return res.status(404).send();
    }
    Blog.getBlogByUserId(user_id).then((blog)=>{
        if(!blog) {
            res.status(404).send('blog not found');
        }else{
            res.send(JSON.stringify(blog, undefined, 2));
        }
    }).catch((e)=>{
        res.send('something went wrong');
    });
});
app.get('/blogs/category/:id',(req,res)=>{
    var category_id = req.params.id
    if (!ObjectID.isValid(category_id)) {
        return res.status(404).send();
    }
    Blog.getBlogByCategoryId(category_id).then((blog)=>{
        if(!blog) {
            res.status(404).send('blog not found');
        }else{
            res.send(blog);
        }
    }).catch((e)=>{
        res.send('something went wrong');
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
    var user_id = jwt.verify(req.header('x-auth'), 'abc123');
    Blog.isOwner(id,user_id._id).then((is_owner)=>{
       if (!is_owner) {
           res.send('doesn\'t has any auth');
       }else{
           Blog.findByIdAndUpdate(id, {$set: info}, {new: true}).then((blog) => {
               if (!blog) {
                   return res.status(404).send();
               }
               res.send({blog});
           }).catch((e) => {
               res.status(400).send();
           })
       }
    }).catch((e)=>{
        res.status(404).send('something wrong');
    });

});
app.delete('/users/blog/:id/',authenticate,(req,res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    //check if the user is owener or not
    var user_id = jwt.verify(req.header('x-auth'), 'abc123');
    Blog.isOwner(id,user_id._id).then((is_owner)=>{
        if (!is_owner) {
            res.send('doesn\'t has any auth');
        }else{
            Blog.findByIdAndRemove(id).then((blog) => {
                if (!blog) {
                    return res.status(404).send();
                }
                res.status(200).send('deleted');
            }).catch((e) => {
                res.status(400).send();
            })
        }
    }).catch((e)=>{
        res.status(404).send('something wrong');
    });

});

//categories
app.get('/categories/all',(req,res)=>{
    Category.getAllCategories().then((categories)=>{
        if (!categories){
            res.status(404).send('categories not found');
        }else{
            res.status(202).send(categories);
        }
    }).catch((e)=>{
        res.status(500).send('something went wrong!!');
    });
});
app.get('/category/:id',(req,res)=>{
    var id = req.params.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Category.getCategoryById(id).then((category)=>{
        if(!category) {
            res.status(404).send('category not found');
        }else{
            res.send(category);
        }

    }).catch((e)=>{
        res.send('something went wrong');
    });


});
app.post('/user/categories/create',authenticate,(req, res)=>{
    var info=_.pick(req.body,['category_title']);

    var category=new Category(info);
    category.save().then(() => {
        res.status(200).send('category added');
    }).catch((e) => {
        res.status(400).send(e);
    })
});
app.patch('/users/categories/:id',authenticate, (req, res) => {
    var id = req.params.id;
    var info =_.pick(req.body,['category_title']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    //check if the user is owener or not
    Category.findByIdAndUpdate(id, {$set: info}, {new: true}).then((category) => {
        if (!category) {
            return res.status(404).send();
        }
        res.send({category});
    }).catch((e) => {
        res.status(400).send();
    });
});
app.delete('/users/categories/:id',authenticate,(req,res)=>{
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    //check if the user is owener or not
    Category.findByIdAndRemove(id).then((category) => {
        if (!category) {
            return res.status(404).send();
        }
        res.status(200).send('deleted');
    }).catch((e) => {
        res.status(400).send();
    })


});

app.listen(port,()=>{
   console.log('started on this port 3000');
});
