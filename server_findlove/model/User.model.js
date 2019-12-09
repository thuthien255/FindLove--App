// Schema User

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
    name    : String,
    gender  : String,
    birthday: Date,
    email   : String,
    password: String,
    opinion : {
        type    : String,
        default : ''
    },
    luotyeuthich : {
        type    : Number,
        default : 0
    },
    avata   : {
        type    : String,
        default : 'avatar.jpg'
    },
    coverImg: {
        type    : String,
        default : 'imgcover.jpg' 
    }
});

const User = mongoose.model('user', userSchema);
exports.USER_MODEL = User;