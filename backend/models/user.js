const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    lastname: {type: String, required: true},
    username: {type: String, required: true, unique: true},//mozda izmjeniti poslije da bude referenca
    imagePath: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},
    date: {type: Date, required: true},
    city: {type: String, required: true},
    country: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    token: {type: String},
    read: [{type: mongoose.Schema.Types.ObjectId, ref: 'Book'}],
    isReading: [{type:mongoose.Schema.Types.ObjectId, ref: 'Book'}],
    toRead: [{type:mongoose.Schema.Types.ObjectId, ref: 'Book'}],
    progress: [{page: Number, size: Number}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    alerts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    odobren: Boolean
})

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);