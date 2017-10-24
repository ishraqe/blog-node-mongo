const mongoose = require('mongoose');
const _=require('lodash');

const blogSchema=mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    blog_header_image:{
        type: String,
        required: true,
    },
    bog_description:{
        type: String,
        required: true,
    },
    categories:{
        type: String,
        required: true,
    },
    user_id:{
        type: String,
        required: true,
    }
});

blogSchema.statics.isOwner= function (blog_id,user_id) {
   //convert this method to is owner of the blog or not
    var Blog = this;
    return Blog.findOne({
        '_id': blog_id,
        'user_id': user_id
    });
};

blogSchema.statics.getBlogById= function (blog_id) {
    var Blog = this;
    return Blog.findOne({
        '_id': blog_id
    });
};

blogSchema.statics.getBlogByUserId = function (user_id) {
    var Blog = this;
    return Blog.find({
        'user_id': user_id.toString()
    });
};
blogSchema.statics.getBlogByCategoryId= function (categories) {
    var Blog = this;
    return Blog.find({
        'categories': categories
    });
};

var Blog= mongoose.model('Blog', blogSchema);
module.exports ={Blog}
