var mongoose = require('mongoose');
var validator= require('validator');

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



var User = mongoose.model('User', UserSchema);

module.exports = {User}

