const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {type: String, required: true},
    authors: [{type: String, required: true}],
    issueDate: {type: Date, required: true},
    genre: [{type: mongoose.Schema.Types.ObjectId, ref: "Genre", required: true}],
    description: {type: String},
    averageScore: {type: Number},
    imagePath:{type: String, required: true},
    numberOfScores: {type: Number},
    odobrena: Boolean
})


module.exports = mongoose.model('Book', bookSchema);