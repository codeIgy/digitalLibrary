const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    score: Number,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
    comment: String
});

module.exports = mongoose.model('Comment', commentSchema);