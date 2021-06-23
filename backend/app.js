const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/book');

mongoose.connect("mongodb+srv://igor:origb13524@cluster0.fjnod.mongodb.net/digitalnaBibl?retryWrites=true&w=majority")//vraca promise ako sve radi(then)
.then(() => {
    console.log('Connected to database!');
})
.catch(() => {
    console.log('Connection failed!');//u slucaju izuzetka
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/backend/images', express.static(path.join('backend/images')));
app.use('/backend/bookImages', express.static(path.join('backend/bookImages')));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    next();
});

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
module.exports = app;