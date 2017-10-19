var mongoose = require('mongoose');
var validator= require('validator');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
   username: {
       type: String,
       required: true,
       trim: true,
       minlength:3,
       unique: true
   },
    email: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message: '{VALUE} is not an email'
        }
    },
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        token: {
           type: String,
           required: true
       },
        access: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = function () {
    var user= this;
    var access = 'auth';
    var token=jwt.sign({_id:user.id,access},'secret').toString();

    user.tokens.push({token, access});
    user.save().then(()=>{
        return token;
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User}

