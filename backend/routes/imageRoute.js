const express = require('express');
const {removeBgImage} =require('../controllers/imageController');
const upload =require('../middleware/multer');
const authUser =require('../middleware/auth');

const imageRouter =express.Router();
imageRouter.post('/remove-bg', upload.single('image'), authUser, removeBgImage);  // auth user for generating clerk id and authenticate user

module.exports =imageRouter;