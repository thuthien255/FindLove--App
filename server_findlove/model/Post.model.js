// Schema Post

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const postSchema = new Schema({
    status: String, 
    img   : String,
    file  : String,
    idUser: {
        type: Schema.Types.ObjectId,
        ref : 'user'
    },
    heart : {
        type: Number,
        default: 0
    },
});

const Post = mongoose.model('post', postSchema);
exports.POST_MODEL = Post;