const Genre = require('../models/genre');
const User = require('../models/user');
const Book = require('../models/book');
const Comment = require('../models/comment');
const { title } = require('process');
const { error } = require('protractor');
const { read } = require('fs');
const { forEach } = require('async');
const book = require('../models/book');
const { follow } = require('./user');
const user = require('../models/user');
const defaultImage = 'default-book-image.jpg';
const Event = require('../models/event');
const EventComment = require('../models/eventComment');
const genre = require('../models/genre');

exports.searchBooks = (req, res, next) => {
    let results = Book.find();
    if (req.body.genre !== 'Svi' && req.body.genre != "") {
        results = results.find({ genre: req.body.genre })
    }
    if (req.body.title !== '') {
        results = results.find({ title: { "$regex": req.body.name, "$options": 'i' } });
    }
    if (req.body.author !== '') {
        results = results.find({ authors: { "$regex": req.body.author, "$options": 'i' } });
    }
    results.populate('genre').then(result => {
        res.status(200).json({
            message: "Search successful!",
            books: result
        });
    })
        .catch(error => {
            res.status(500).json({
                message: 'Failure',
                books: []
            })
        })
}

exports.getGenres = (req, res, next) => {
    const genreQuery = Genre.find();
    genreQuery.then(documents => {
        res.status(200).json({
            message: 'Success',
            genres: documents
        });
    })
        .catch(error => {
            res.status(500).json({
                message: 'Query error'
            })
        });
}

exports.addBook = (req, res, next) => {
    var url = req.protocol + '://' + req.get('host') + '/backend/bookImages/';
    if (req.file) {
        url = url + req.file.filename;
    }
    else url = url + defaultImage;
    const book = new Book({
        title: req.body.title,
        imagePath: url,
        authors: req.body.author.split('@'),
        issueDate: new Date(req.body.issueDate),
        description: req.body.description,
        genre: req.body.genre.split(' '),
        averageScore: 0,
        odobrena: false
    });
    book.save().then(result => {
        res.status(201).json({
            message: 'Book created successfully!'
        })
    })
        .catch(err => {
            res.status(500).json({
                message: 'Failed to create the book'
            })
        });
}

exports.getBook = (req, res, next) => {
    const id = req.query.book_id;
    let query = Book.findOne({ _id: id }).populate('genre');
    query.then(result => {
        if (result == null) {
            res.status(404).json({
                message: 'Book not found!',
                book: result
            })
        }
        else {
            res.status(200).json({
                message: 'Book found!',
                book: result
            })
        }
    })
        .catch(err => {
            res.status(500).json({
                message: 'Error!',
                book: null
            })
        })
}

exports.getUserRead = (req, res, next) => {
    const user_id = req.query.user_id;
    const currentPagetoRead = +req.query.currentPagetoRead;
    const pageSizetoRead = +req.query.pageSizetoRead;
    const currentPageRead = +req.query.currentPageRead;
    const pageSizeRead = +req.query.pageSizeRead;
    const currentPageisReading = +req.query.currentPageisReading;
    const pageSizeisReading = +req.query.pageSizeisReading;

    if (user_id == null || user_id === 'undefined') return res.status(404).json({ message: 'User is null!' });

    const query = User.findById(user_id);

    //query
    //.populate('toRead')
    //.populate('read')
    //.populate('isReading');

    query.populate('toRead').populate('read').populate('isReading').then(result => {
        let arra;
        let toRead = [];
        let toReadCount = result.toRead.length;
        arra = result.toRead;
        for (i = (currentPagetoRead - 1) * pageSizetoRead; i < (currentPagetoRead - 1) * pageSizetoRead + pageSizetoRead && i < arra.length; i++) {
            toRead.push(arra[i]);
        }
        let read1 = [];
        let readCount = result.read.length;
        arra = result.read;
        for (i = (currentPageRead - 1) * pageSizeRead; i < (currentPageRead - 1) * pageSizeRead + pageSizeRead && i < arra.length; i++) {
            read1.push(arra[i]);
        }
        let isReading = [];
        let isReadingCount = result.isReading.length;
        arra = result.isReading;
        for (i = (currentPageisReading - 1) * pageSizeisReading; i < (currentPageisReading - 1) * pageSizeisReading + pageSizeisReading && i < arra.length; i++) {
            isReading.push(arra[i]);
        }
        return res.status(200).json({
            message: 'Retrieved successfuly',
            read: read1,
            readCount: readCount,
            toRead: toRead,
            toReadCount: toReadCount,
            isReading: isReading,
            isReadingCount: isReadingCount
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Error'
            })
        })
}

exports.getReg = (req, res, next) => {
    const user_id = req.query.user_id;
    const book_id = req.query.book_id;

    if (user_id == null || user_id === undefined) return res.status(404).json({ message: 'User is null!' });

    const query = User.findById(user_id);

    //query
    //.populate('toRead')
    //.populate('read')
    //.populate('isReading');

    query.populate('toRead').populate('read').populate('isReading').populate('alerts').then(result => {
        let arra;
        let data = null;
        let toRead = [];
        arra = result.toRead;
        for (i = 0; i < arra.length; i++) {
            if (arra[i]._id == book_id) {
                data = { book: arra[i], status: 'za_citanje', page: 0, size: 100 };
            }
        }
        arra = result.isReading;
        for (i = 0; i < arra.length && data == null; i++) {
            if (arra[i]._id == book_id) {
                data = { book: arra[i], status: 'cita', page: result.progress[i].page, size: result.progress[i].size };
            }
        }
        arra = result.read;
        for (i = 0; i < arra.length && data == null; i++) {
            if (arra[i]._id == book_id) {
                data = { book: arra[i], status: 'procitao', page: 0, size: 0 };
            }
        }
        if (data != null) {
            Genre.populate(data.book, { 'path': 'genre' }).then(result => {
                data.book = result;
                return res.status(200).json({
                    message: 'Retrieved successfuly',
                    book: data
                })
            })
        }
        else {
            Book.findById(book_id).populate('genre').then(result => {
                data = { book: result, status: '', page: 0, size: 100 }
                return res.status(200).json({
                    message: 'Retrieved',
                    book: data
                })
            })
        }
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Error',
                data: null
            })
        })
}

exports.getComments = (req, res, next) => {
    const book_id = req.query.book_id;

    const query = Comment.find({ book: book_id });

    query.then(result => {
        result.forEach(element => {
            element.author = null;
        });
        res.status(200).json({
            message: 'Success!',
            comments: result
        })
    })
        .catch(err => {
            res.status(500).json({
                message: 'Error!'
            })
        })
}

exports.getCommentsReg = (req, res, next) => {
    const book_id = req.query.book_id;
    const query = Comment.find({ book: book_id });

    query.populate('author').then(result => {

        res.status(200).json({
            message: 'Success!',
            comments: result
        })
    })
        .catch(err => {
            res.status(500).json({
                message: 'Error!'
            })
        })
}

exports.addComment = (req, res, next) => {
    const book_id = req.body.book_id;
    const user_id = req.body.user_id;
    const comment = req.body.comment;
    const score = +req.body.score;

    const commentSch = new Comment({
        book: book_id,
        author: user_id,
        comment: comment,
        score: score
    });
    let averageScore;
    let saved_id;
    commentSch.save().then(result => {
        saved_id = result._id;
        const query2 = User.findById(user_id);
        query2.then(result => {
            let query3;
            let i = 0;
            for (i = 0; result != null && i < result.followers.length; i++) {
                query3 = User.findById(result.followers[i])
                    .then(follower => {
                        follower.alerts.push(saved_id);
                        follower.save().then(res => {

                        });
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        })
        const query = Book.findById(book_id);
        query.then(book => {
            averageScore = book.averageScore;
            if (averageScore == 0) {
                book.averageScore = score;
                book.numberOfScores = 1;
            }
            else {
                book.averageScore = (averageScore * (book.numberOfScores) + score) / (book.numberOfScores + 1);
                book.numberOfScores = book.numberOfScores + 1;
            }
            averageScore = book.averageScore;
            book.save().then(result2 => {
                return res.status(201).json({
                    message: 'Success!',
                    averageScore: averageScore,
                    _id: saved_id
                })
            })
        })

    })
        .catch(err => {
            return res.status(500).json({
                message: 'Error!'
            });
        })
}

exports.editComment = (req, res, next) => {
    const book_id = req.body.book_id;
    const comm_id = req.body.comm_id;
    const comment = req.body.comment;
    const score = +req.body.score;
    const comQuery = Comment.findById(comm_id);
    let averageScore;
    let oldScore;
    comQuery.then(comm => {
        oldScore = comm.score;
        comm.comment = comment;
        comm.score = score;
        comm.save().then(result => {
            const query = Book.findById(book_id);
            query.then(book => {
                averageScore = book.averageScore;
                book.averageScore = (averageScore * (book.numberOfScores) + score - oldScore) / (book.numberOfScores);
                averageScore = book.averageScore;
                book.save().then(result2 => {
                    return res.status(201).json({
                        message: 'Success!',
                        averageScore: averageScore
                    })
                })
            })

        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Error!'
            });
        })

}

exports.getAlerts = (req, res, next) => {
    const user_id = req.query.user_id;

    let query = User.findById(user_id).populate({ path: 'alerts', populate: [{ path: 'author' }, { path: 'book' }] });
    let alerts;
    query.then(result => {
        if (result.alerts == null || result.alerts == []) {
            return res.status(200).json({
                message: 'Success',
                alerts: []
            })
        }
        else {
            alerts = result.alerts;
            result.alerts = [];
            console.log('Dosao');
            console.log(alerts);
            result.save().then(saved => {
                return res.status(200).json({
                    message: 'Success',
                    alerts: alerts
                })
            })
        }
    }).catch(err => {
        return res.status(500).json({
            message: 'Failure',
            alerts: []
        })
    })
}

exports.addEvent = (req, res, next) => {
    const title = req.body.title;
    const start = req.body.start;
    const end = req.body.end;
    const now = req.body.now;
    const endless = req.body.endless;
    const description = req.body.description;
    const javni = req.body.javni;
    const added = req.body.added;
    const user_id = req.body.user_id;

    const startDate = now ? new Date() : new Date(start);
    const endDate = endless ? null : new Date(end);
    console.log(startDate);
    console.log(endDate);
    const type = javni ? 'javni' : 'privatni';
    const addedUsers = javni ? [user_id] : added;
    const EventSch = new Event({
        title: title,
        start: startDate,
        end: endDate,
        endless: endless,
        creator: user_id,
        description: description,
        type: type,
        participants: addedUsers,
        awaiting: []
    });

    EventSch.participants.push(user_id);

    EventSch.save().then(result => {
        return res.status(201).json({
            message: 'Added'
        })
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Error'
            })
        })
}

exports.getEvents = (req, res, next) => {
    const query = Event.find();

    query.then(result => {
        return res.status(200).json({
            message: 'Success',
            events: result
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Error',
                events: []
            })
        })
}

exports.getEventById = (req, res, next) => {
    const query = Event.findById(req.query.event_id).populate('creator').populate('awaiting');

    query.then(result => {

        return res.status(200).json({
            message: 'Success',
            event: result
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Error',
                event: null
            })
        })
}

exports.joinEvent = (req, res, next) => {
    const user_id = req.body.user_id;
    const event_id = req.body.event_id;

    const query = Event.findById(event_id);

    query.then(result => {
        result.awaiting.push(user_id);
        result.save().then(result2 => {
            return res.status(201).json({
                message: 'Success'
            })
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Fail'
            })
        })
}

exports.approveJoin = (req, res, next) => {
    const user_id = req.body.user_id;
    const event_id = req.body.event_id;

    const query = Event.findById(event_id);

    query.then(result => {
        console.log(result.awaiting.length);
        let i = 0;
        for (i = 0; i < result.awaiting.length; i++) {
            if (result.awaiting[i] == user_id) break;
        }
        console.log(i);
        if (i < result.awaiting.length) {
            result.awaiting.splice(i, 1);
            result.participants.push(user_id);
        }
        console.log(result);
        result.save().then(result2 => {
            return res.status(201).json({
                message: 'Success'
            })
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Fail'
            })
        })
}

exports.commentEvent = (req, res, next) => {
    const user_id = req.body.user_id;
    const event_id = req.body.event_id;
    const comment = req.body.comment;

    const EventCommentSch = new EventComment({
        author: user_id,
        comment: comment,
        event: event_id
    });

    EventCommentSch.save().then(result => {
        console.log(result);
        return res.status(201).json({
            message: 'Success'
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Fail'
            })
        })
}

exports.getEventComments = (req, res, next) => {
    const event_id = req.query.event_id;
    const query = EventComment.find({ event: { $eq: event_id } }).populate('author');
    console.log(event_id);
    query.then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Success',
            comments: result
        })
    })
        .catch(err => {
            res.status(200).json({
                message: 'Fail',
                comments: []
            })
        })
}

exports.declineRequest = (req, res, next) => {
    const user_id = req.body.user_id;
    const event_id = req.body.event_id;

    const query = Event.findById(event_id);

    query.then(result => {
        let i = 0;
        for (i = 0; i < result.awaiting.length; i++) {
            if (result.awaiting[i] == user_id) break;
        }
        if (i < result.awaiting.length) {
            result.awaiting.splice(i, 1);
        }
        result.save().then(result2 => {
            return res.status(201).json({
                message: 'Success'
            })
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Fail'
            })
        })
}

exports.activateEvent = (req, res, next) => {
    const event_id = req.body.event_id;

    const query = Event.findById(event_id);

    query.then(result => {
        result.start = new Date(new Date().getMilliseconds() + 3600000);
        result.endless = true;
        result.save().then(result2 => {
            return res.status(200).json({
                message: 'Success'
            })
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Failure'
            })
        })
}

exports.stopEvent = (req, res, next) => {
    const event_id = req.body.event_id;

    const query = Event.findById(event_id);

    query.then(result => {
        result.end = new Date(new Date().getMilliseconds() + 3600000);
        result.endless = false;
        result.save().then(result2 => {
            return res.status(200).json({
                message: 'Success'
            })
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Failure'
            })
        })
}

exports.odobriKnjigu = (req, res, next) => {
    const book_id = req.body.book_id;

    const query = Book.findById(book_id);

    query.then(result => {
        result.odobrena = true;
        result.save().then(result2 => {
            return res.status(200).json({
                message: 'ok'
            })
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'ok'
            })
        })
}

exports.neOdobriKnjigu = (req, res, next) => {
    const book_id = req.body.book_id;

    const query = Book.deleteOne({ _id: book_id });

    query.then(result => {
        return res.status(200).json({
            message: 'ok'
        })
    })
        .catch(err => {
            return res.status(500).json({
                message: 'ok'
            })
        })
}

exports.updateBook = (req, res, next) => {
    let imagePath = req.body.image;
    console.log(imagePath);
    if (req.file) {//bice undefined ako nema file-a 
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/backend/bookImages/' + req.file.filename;
    }
    const query = User.updateOne({ _id: req.body._id }, { title: req.body.title, imagePath: req.body.imagePath, authors: req.body.author.split('@'), issueDate: new Date(req.body.issueDate), description: req.body.description, genre: req.body.genre.split(' ') });
    query.then(result => {
        console.log(result);
        User.findById(req.body._id).then(result => {
            return res.status(201).json({
                message: null,
                user: result
            })
        })
            .catch(err => {
                return res.status(500).json({
                    message: 'Ne postoji korisnik!',
                    user: null
                })
            })

    })
        .catch(err => {
            return res.status(500).json({
                message: err.keyPattern,
                user: null
            })
        })

}

exports.dodajZanr = (req, res, next) => {
    const naziv = req.body.naziv;

    const query = new Genre({
        name: naziv
    });

    query.save().then(result => {
        res.status(201).json({
            message: 'Success'
        })
    })
        .catch(err => {

        })
}

exports.obrisiZanr = (req, res, next) => {
    const genre_id = req.query.genre_id;

    const query = Book.find();
    console.log(genre_id);
    query.then(result => {
        let nekoristi = true;
        let i = 0;
        let j = 0;
        for (j = 0; j < result.length && nekoristi; j++)
            for (i = 0; i < result[j].genre.length; i++) {
                if (result[j].genre[i]._id == genre_id) {
                    nekoristi = false;
                    break;
                }
            }
        if (!nekoristi) {
            return res.status(200).json({
                message: 'Žanr se koristi'
            });
        }
        else {
            Genre.deleteOne({ _id: genre_id }).then(result2 => {
                return res.status(200).json({
                    message: 'Success'
                });
            }, err => {
                console.log(err);
                return res.status(500).json({
                    message: 'Error!'
                })
            })
        }
    })
}

exports.stopEvent = (req, res, next) => {
    const event_id = req.body.event_id;
    const query = Event.updateOne({ _id: event_id }, { endless: false, end: new Date() });

    query.then(result => {
        return res.status(200).json({
            message: 'Success'
        })
    }, err => {
        console.log(err);
    })
}

exports.activateEvent = (req, res, next) => {
    const event_id = req.body.event_id;
    const query = Event.updateOne({ _id: event_id }, { endless: true, start: new Date() });

    query.then(result => {
        return res.status(200).json({
            message: 'Success'
        })
    }, err => {
        console.log(err);
    })
}

exports.getByGenres = (req, res, next) => {
    let genres = [];
    const query = Genre.find().then(result => {
        let i = 0;
        for (i = 0; i < result.length; i++) {
            genres.push({ y: 0, name: result[i].name });
        }
        Book.find().populate('genre').then(result2 => {
            let j = 0;
            let z = 0;
            let k = 0;
            for (j = 0; j < result2.length; j++) {
                for (k = 0; k < result2[j].genre.length; k++)
                    for (z = 0; z < genres.length; z++) {
                        if (genres[z].name == result2[j].genre[k].name) {
                            genres[z].y = genres[z].y + 1;
                            break;
                        }
                    }
            }
            console.log(genres);
            return res.status(200).json({
                message: 'Success',
                data: genres
            })
        })
    }).catch(err => {
        console.log(err);
        return res.status(500).json({
            message: 'Failure',
            data: []
        })
    })
}