var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.ObjectId;

var PostSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: ObjectId, // 添加作者 ID.
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;