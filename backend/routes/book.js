const express = require('express');

const BookController = require('../controllers/book');
const imageExtraction = require('../middleware/multer_book');
const router = express.Router();

router.post('/searchG', BookController.searchBooks);
router.get('/genres', BookController.getGenres);
router.post('/add',imageExtraction,BookController.addBook);
router.get('',BookController.getBook);
router.get('/getPages', BookController.getUserRead);
router.get('/reg', BookController.getReg);
router.get('/getComments', BookController.getComments);
router.get('/getCommentsReg', BookController.getCommentsReg);
router.post('/addComment', BookController.addComment);
router.patch('/editComment', BookController.editComment);
router.get('/getAlerts', BookController.getAlerts);
router.post('/addEvent', BookController.addEvent);
router.get('/getEvents', BookController.getEvents);
router.get('/getEventComments', BookController.getEventComments);
router.post('/commentEvent',BookController.commentEvent);
router.post('/acceptEventRequest', BookController.approveJoin);
router.post('/addEventRequest', BookController.joinEvent);
router.get('/getEventById', BookController.getEventById);
router.post('/declineEventRequest', BookController.declineRequest);
router.post('/neOdobriKnjigu', BookController.neOdobriKnjigu);
router.post('/odobriKnjigu', BookController.odobriKnjigu);
router.patch('/updateBook', imageExtraction, BookController.updateBook);
router.post('/dodajZanr', BookController.dodajZanr);
router.delete('/izbrisiZanr', BookController.obrisiZanr);
router.post('/stopEvent', BookController.stopEvent);
router.post('/activateEvent', BookController.activateEvent);
router.get('/getByGenres', BookController.getByGenres);

module.exports = router;