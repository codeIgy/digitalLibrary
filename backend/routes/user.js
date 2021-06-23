const express = require('express');

const UserController = require('../controllers/user');
const imageExtraction = require('../middleware/multer');
const router = express.Router();

router.post('/signup', imageExtraction, UserController.createUser);
router.post('/login', UserController.login);
router.post('/forgot', UserController.forgot);
router.post('/reset', UserController.reset);
router.post('/resetLogin', UserController.resetLogin);
router.patch('/updateUser', imageExtraction,UserController.updateUser);
router.delete('/toReadDelete', UserController.toReadDelete);
router.post('/toRead', UserController.toRead);//dodaj na listu za citanje
router.post('/isReading',UserController.isReading);//pocni da citas
router.post('/read', UserController.read);//korisnik je procitao knjigu
router.post('/updateRead', UserController.updateRead);//promjena ukupnog broja strana i trenutne strane
router.get('/getCommentsReg', UserController.getCommentsReg);
router.get('/getUserById', UserController.getUserById);
router.post('/follow', UserController.follow);
router.post('/unfollow', UserController.unfollow);
router.post('/searchUser', UserController.searchUsers);
router.post('/getFollowing', UserController.getFollowing);
router.post('/odobriKorisnika', UserController.odobriKorisnika);
router.post('/neOdobriKorisnika', UserController.neOdobriKorisnika);
router.post('/postaviNaModeratora',UserController.postaviNaModeratora);
router.post('/postaviNaNormalnog',UserController.postaviNaNormalnog);

module.exports = router;