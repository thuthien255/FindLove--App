const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const moreInfoSchema = new Schema({
    sologan   : {
        type    : String,
        default : '...'
    },
    introduce : {
        type    : String,
        default : '...'
    },
    height    : {
        type    : Number,
        default : ''
    },
    dress     : {
        type    : String,
        default : '...'
    },
    weight    : {
        type    : Number,
        default : ''
    },
    homeTown  : {
        type    : String,
        default : '...'
    },
    school    : {
        type    : String,
        default : '...'
    },
    job       : {
        type    : String,
        default : '...'
    },
    salary    : {
        type    : String,
        default : '...'
    },
    hobby     : {
        type    : String,
        default : '...'
    },
    viewOfLove: {
        type    : String,
        default : '...'
    },
    kindOfLover: {
        type    : String,
        default : '...'
    },
    idUser: {
        type: Schema.Types.ObjectId,
        ref : 'user'
    },
    age   : {
        type: Number,
    }
});

const moreInfo = mongoose.model('moreInfo', moreInfoSchema);
exports.MOREINFO_MODEL = moreInfo;