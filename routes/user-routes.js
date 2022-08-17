const express = require('express');
const router = express.Router();
const fileExtract = require('../middleware/fileExtract');

const userController = require('../controllers/user-controller')


// Create user 


router.post('/create' , userController.createUser);


// Login user

router.post('/login' , userController.logInUser);


// Get user

router.get('/:id' , userController.getUser);


// Get appointments

router.get('/appointments/:id' , userController.getAppointments)
// Change image

router.put('/:id' , fileExtract , userController.changeImage);

module.exports = router;