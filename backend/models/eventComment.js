const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    event: {type: mongoose.Schema.Types.ObjectId, ref: 'Event'},
    comment: String
});

module.exports = mongoose.model('EventComment', commentSchema);