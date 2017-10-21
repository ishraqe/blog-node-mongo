const mongoose = require('mongoose');
const _=require('lodash');

const categorySchema=mongoose.Schema({
    category_title:{
        type: String,
        required: true
    }
});


categorySchema.statics.getCategoryById= function (category_id) {
    var Category = this;
    return Category.findOne({
        '_id': category_id
    });
};

categorySchema.statics.getAllCategories= function () {
    var Category = this;
    return Category.find({});
};

var Category= mongoose.model('Category', categorySchema);
module.exports ={Category}