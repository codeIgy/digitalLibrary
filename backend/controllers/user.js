const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const request = require("request");
const defaultImage = 'default-user-icon.jpg'
const User = require('../models/user');
const { response, query } = require('express');
const async = require('async');
const crypto = require('crypto-random-string');
const nodemailer = require('nodemailer');
const Book = require('../models/book');
const Comment = require('../models/comment');

exports.createUser = (req, res, next) => {
    if (req.body.captcha === undefined ||
        req.body.captcha === '' ||
        req.body.captcha === null) {
        return res.status(500).json({ success: false, msg: 'Please select captcha' });
    }

    const secretKey = '6Lfa6sYZAAAAAKEKkTwxsN3KM0edGPFpCSnS8mBN'

    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=
    ${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        if (body.success !== undefined && !body.success) {
            return res.status(500).json({ success: false, msg: 'Failed captcha verification' });
        }

        bcrypt.hash(req.body.password, 10).then(hash => {
            var url = req.protocol + '://' + req.get('host') + '/backend/images/';
            if (req.file) {
                url = url + req.file.filename;
            }
            else url = url + defaultImage;
            const user = new User({
                name: req.body.name,
                lastname: req.body.lastname,
                username: req.body.username,
                imagePath: url,
                password: hash,
                email: req.body.email,
                city: req.body.city,
                country: req.body.country,
                date: new Date(req.body.date),
                odobren: false,
                type: 'normalni'
            });
            user.save().then(result => {
                res.status(201).json({
                    message: 'User created!',
                    result: result
                });
            })
                .catch(error => {
                    console.log(error);
                    res.status(500).json({
                        message: 'Invalid input!'
                    })
                })
        });
    })
}

exports.login = (req, res, next) => {
    let fetchedUser;
    User.findOne({ username: req.body.username }).populate('followers').populate('following').populate('isReading')
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Pogrešno korisničko ime!'
                })
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Netačna lozinka!'
                });
            }
            const token = jwt.sign({ _id: fetchedUser._id }, 'thisisakeyforjwtsign');
            fetchedUser.toRead = [];
            fetchedUser.isReading = [];
            fetchedUser.read = [];
            fetchedUser.password = '';
            if (fetchedUser.odobren) {
                res.status(200).json({
                    token: token,
                    user: fetchedUser
                });
            }
            else{
                res.status(401).json({
                    message: 'Nije odobrena registracija'
                });
            }
        })
        .catch(err => {

        })
}

exports.forgot = (req, res, next) => {
    let token = crypto({ length: 20, type: 'url-safe' });
    async.waterfall([
        function (done) {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    return res.status(404).json({ message: 'Invalid email!' });
                }
                user.token = token;

                user.save(function (err) {
                    done(err, token, user);
                });
            });
        }, function (token, user, done) {
            var smtpTransport = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'digitalnabibliotekapia@gmail.com',
                    pass: 'digitalnabibl3@'
                }
            });
            var mailOptions = {
                to: user.email,
                from: '',
                subject: 'Digitalna biblioteka - Zaboravljena lozinka',
                text: 'Kliknite na sljedeći link ukoliko želite da promijenite lozinku: \n\n' +
                    'http://localhost:4200/reset/' + token + '\n\n'
            }
            smtpTransport.sendMail(mailOptions, function (err) {
                res.status(200).json({ message: 'Email sent' });
            });
        }
    ], function (err) {
        if (err) return next(err);
    })
}

exports.reset = (req, res, next) => {
    User.findOne({ token: req.body.token })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Token does not exist' });
            }
            console.log(user);
            user.token = undefined;
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    user.password = hash;
                    console.log(user);
                    user.save().then(result => {
                        return res.status(201).json({
                            message: 'Password changed!'
                        });
                    })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).json({
                                message: 'Error upon saving'
                            })
                        })
                })
                .catch(err => {
                    return res.status(500).json({ message: 'Hash failure' });
                })
        })
}
exports.resetLogin = (req, res, next) => {
    if (req.body.user == null || req.body.user == undefined) return res.status(401).json({
        message: 'Niste ulogovani!'
    });
    let useracc;
    User.findOne({ _id: req.body.user._id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User does not exist' });
            }
            console.log(user);
            useracc = user;
            return bcrypt.compare(req.body.passwordOld, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Netačna lozinka!'
                });
            }
            bcrypt.hash(req.body.password, 10)
                .then(hash => {
                    useracc.password = hash;
                    console.log(useracc);
                    useracc.save().then(result => {
                        return res.status(201).json({
                            message: 'Password changed!'
                        });
                    })
                        .catch(err => {
                            console.log(err);
                            return res.status(500).json({
                                message: 'Error upon saving'
                            })
                        })
                })
        })
        .catch(err => {

        })

}

exports.updateUser = (req, res, next) => {
    let imagePath = req.body.imagePath;
    console.log(imagePath);
    if (req.file) {//bice undefined ako nema file-a 
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + '/backend/images/' + req.file.filename;
    }
    const query = User.updateOne({ _id: req.body._id }, { name: req.body.name, lastname: req.body.lastname, username: req.body.username, imagePath: imagePath, date: new Date(req.body.date), city: req.body.city, country: req.body.country, email: req.body.email });
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

exports.toReadDelete = (req, res, next) => {
    console.log('brisanje toRead');
    const userId = req.query.user_id;
    const bookId = req.query.book_id;
    console.log(userId);
    console.log(bookId);
    const query = User.findOne({ _id: userId });
    query.then(result => {
        console.log(result);
        let array = result.toRead;
        for (i = 0; i < array.length; i++) {
            if (array[i] == bookId) break;
        }
        if (i < array.length) array.splice(i, 1);
        console.log(array);
        result.toRead = array;
        console.log(result);
        result.save().then(resul => {
            res.status(200).json({
                message: 'Success'
            })
        });
    })
        .catch(err => {
            return res.status(500).json({
                message: "Error"
            });
        })
}

exports.toRead = (req, res, next) => {
    const user_id = req.query.user_id;
    const book_id = req.query.book_id;

    const query = User.findById(user_id);

    query.then(result => {
        let toRead = result.toRead;
        toRead.push(book_id);
        result.toRead = toRead;
        console.log(result);
        result.save().then(okay => {
            res.status(201).json({
                message: 'Added toRead'
            })
        })
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error'
            })
        })
}

exports.isReading = (req, res, next) => {
    const user_id = req.query.user_id;
    const book_id = req.query.book_id;
    const page = +req.query.page;
    const size = +req.query.size;

    const query = User.findById(user_id);

    query.then(result => {
        console.log(result);
        let isReading = result.isReading;
        isReading.push(book_id);
        console.log(isReading);
        result.isReading = isReading;
        let progress = result.progress;
        progress.push({ page: page, size: size });
        result.progress = progress;
        console.log(result);
        result.save().then(okay => {
            res.status(201).json({
                message: 'Added isReading'
            })
        })
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error'
            })
        })
}

exports.read = (req, res, next) => {
    const user_id = req.query.user_id;
    const book_id = req.query.book_id;

    const query = User.findById(user_id);

    query.then(result => {
        console.log(result);
        let isReading = result.isReading;
        for (i = 0; i < isReading.length; i++) {
            if (isReading[i] == book_id) break;
        }
        if (i == isReading.length) return res.status(500);
        isReading.splice(i, 1);
        console.log(isReading);
        result.isReading = isReading;
        let progress = result.progress;
        progress.splice(i, 1);
        result.progress = progress;
        result.read.push(book_id);
        console.log(result);
        result.save().then(okay => {
            res.status(200).json({
                message: 'Read'
            })
        })
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error'
            })
        })
}

exports.updateRead = (req, res, next) => {
    const user_id = req.query.user_id;
    const book_id = req.query.book_id;
    const page = +req.query.page;
    const size = +req.query.size;

    const query = User.findById(user_id);

    query.then(result => {
        console.log(result);
        let isReading = result.isReading;
        for (i = 0; i < isReading.length; i++) {
            if (isReading[i] == book_id) break;
        }
        if (i == isReading.length) return res.status(500);
        result.progress[i].page = page;
        result.progress[i].size = size;
        console.log(result);
        result.save().then(okay => {
            res.status(200).json({
                message: 'Read'
            })
        })
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error'
            })
        })
}

exports.getCommentsReg = (req, res, next) => {
    const user_id = req.query.user_id;

    const query = Comment.find({ author: user_id });

    query.populate('book').then(result => {
        console.log(result);
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

exports.follow = (req, res, next) => {
    const logged_id = req.body.logged_id;
    const user_id = req.body.user_id;

    let query = User.findById(user_id);
    let query2 = User.findById(logged_id);

    query2.then(result => {
        result.following.push(user_id);
        result.save().then(res => {

        });
    }).catch(err => {

    });

    query.then(result => {
        if (result != null) {
            result.followers.push(logged_id);
        }
        console.log(result);
        result.save().then(saved => {
            res.status(201).json({
                message: 'Success!'
            });
        })
    }).catch(err => {
        res.status(500).json({
            message: 'Failure'
        })
    });
}

exports.unfollow = (req, res, next) => {
    const logged_id = req.body.logged_id;
    const user_id = req.body.user_id;
    console.log('unfollow');
    let query = User.findById(user_id);

    User.findById(logged_id).then(result => {
        for (let i = 0; i < result.following.length; i++) {
            if (result.following[i] == user_id) {
                result.following.splice(i, 1);
                break;
            }
        }
        result.save().then(res2 => {

        });
    })
        .catch(err => {

        });

    query.then(result => {
        if (result != null) {
            for (let i = 0; i < result.followers.length; i++) {
                if (result.followers[i] == logged_id) {
                    result.followers.splice(i, 1);
                    break;
                }
            }
        }
        result.save().then(saved => {
            res.status(200).json({
                message: 'Success!'
            });
        })
    }).catch(err => {
        res.status(500).json({
            message: 'Failure'
        })
    });
}

exports.getUserById = (req, res, next) => {
    let query = User.findById(req.query.user_id);
    let prati = false;

    query.then(result => {
        console.log(result);
        for (let i = 0; result != null && i < result.followers.length; i++) {
            if (result.followers[i] == req.query.logged_id) {
                prati = true;
                break;
            }
        }
        return res.status(200).json({
            message: 'Success',
            user: result,
            prati: prati
        });
    })
        .catch(err => {
            return res.status(500).json({
                message: 'Failure'
            })
        })
}

exports.searchUsers = (req, res, next) => {
    let result = User.find();
    if (req.body.name != '') {
        result = result.find({ name: { '$regex': req.body.name, '$options': 'i' } });
    }
    if (req.body.lastname != '') {
        result = result.find({ lastname: { '$regex': req.body.lastname, '$options': 'i' } });
    }
    if (req.body.username != '') {
        result = result.find({ username: { '$regex': req.body.username, '$options': 'i' } });
    }
    if (req.body.email != '') {
        result = result.find({ email: { '$regex': req.body.email, '$options': 'i' } });
    }
    result.then(users => {
        console.log(users);
        return res.status(200).json({
            message: 'Success',
            users: users
        })
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Error'
            })
        })
}

exports.getFollowing = (req, res, next) => {
    const user_id = req.body.user_id;

    console.log(user_id);

    const query = User.findById(user_id).populate('following');
    query.then(result => {
        return res.status(200).json({
            message: 'Success',
            following: result.following
        })
    })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Failure',
                following: []
            })
        })
}

exports.odobriKorisnika = (req, res, next) => {
    const user_id = req.body.user_id;

    const query = User.findById(user_id);

    query.then(result => {
        result.odobren = true;
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

exports.neOdobriKorisnika = (req, res, next) => {
    const user_id = req.body.user_id;
    console.log(user_id);
    const query = User.deleteOne({_id: user_id});

    query.then(result => {
        console.log(result);
        return res.status(200).json({
            message: 'ok'
        })
    })
    .catch(err => {
        console.log(err);
        return res.status(500).json({
            message: 'ok'
        })
    })
}

exports.postaviNaModeratora = (req,res,next) => {
    const user_id = req.body.user_id;

    const query = User.findById(user_id);

    query.then(result => {
        result.type = 'moderator';
        result.save().then(result2 => {
            return res.status(200).json({
                message: 'Success'
            })
        })
    }, err => {
        return res.status(500).json({
            message: 'Failure'
        })
    })
}

exports.postaviNaNormalnog = (req, res, next) => {
    const user_id = req.body.user_id;

    const query = User.findById(user_id);

    query.then(result => {
        result.type = 'normalni';
        result.save().then(result2 => {
            return res.status(200).json({
                message: 'Success'
            })
        })
    }, err => {
        return res.status(500).json({
            message: 'Failure'
        })
    })
}