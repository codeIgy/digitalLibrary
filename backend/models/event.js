const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: String,
    start: Date,
    end: Date,
    endless: Boolean,
    description: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    type: String,
    participants: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    awaiting: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
})

module.exports = mongoose.model('Event', eventSchema);