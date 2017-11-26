var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;