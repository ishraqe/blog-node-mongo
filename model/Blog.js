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

blogSchema.statics.findBlogById= function (id) {
   //convert this method to is owner of the blog or not

    var Blog = this;
    return Blog.findOne({
        '_id': id
    });
}

blogSchema.statics.updateBlog=function (blog) {
    var Blog = this;
    blog.update({blog}).then(()=>{

    })
}


var Blog= mongoose.model('Blog', blogSchema);
module.exports ={Blog}