var mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://ishraqe:ishnonymous1@ds123173.mlab.com:23173/next-blog"
);

module.exports = { mongoose };
