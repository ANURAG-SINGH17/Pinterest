const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const { registerUser, loginUser, createPin, logoutUser, getProfile, deletePin, savePin, createBio  , setProfilePicture , startFollow, comments, deleteComments, deleteCommentsAsOwner, unsavepin, getAllPins, getUserProfile, unSavePin, unFollow} = require('../controller/user.controller');
const { isLogIn } = require('../middleware/isLogIn');
const upload = require('../middleware/multer');

router.post('/register' , [
    body('email').isEmail().withMessage('invalid email'),
    body('username').isLength({min:3}).withMessage('username must be 3 character long'),
    body('password').isLength({min:8}).withMessage('password must be at least 8 character long')
] , registerUser);

router.post('/login' , [
    body('email').isEmail().withMessage('invalid email'),
    body('password').isLength({min:8}).withMessage('password must be at least 8 character long')
], loginUser)

router.get('/logout' , logoutUser);

router.post('/createPin', isLogIn , upload.single('image') ,createPin);

router.delete('/deletePin', isLogIn , deletePin);

router.patch('/comment', isLogIn , comments);

router.delete('/delete_comment' , isLogIn , deleteComments);

router.delete('/delete_comment_owner', isLogIn , deleteCommentsAsOwner)

router.get('/getProfile' , isLogIn , getProfile);

router.patch('/savePin', isLogIn , savePin);

router.patch('/unSavePin', isLogIn , unSavePin);

router.delete('/unsavePin', isLogIn , unsavepin);

router.patch('/createBio', isLogIn , createBio);

router.patch('/startFollow' , isLogIn , startFollow);

router.patch('/unFollow' , isLogIn , unFollow)

router.patch('/setProfile' , isLogIn ,upload.single('image') ,setProfilePicture);

router.get('/getAllPins' , getAllPins);

router.get('/getUserProfile/:userId', isLogIn , getUserProfile)

module.exports = router
