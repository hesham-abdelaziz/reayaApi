const express = require('express');
const router = express.Router();
const fileExtract = require('../middleware/imagesExtract');

const clinicController = require('../controllers/clinic-controller');

// Get clinics

router.get('/:id' , clinicController.getClinics);

// Get single clinic

router.get('/single/:id' , clinicController.getSingleClinic);

// Add clinic 

router.post('/add' , fileExtract , clinicController.addClinic);


// Edit clinic 

router.put('/edit/:id' , fileExtract , clinicController.editClinic);

// Delete clinic

router.delete('/delete/:id' , clinicController.deleteClinic);
// Add time


router.post('/time/:id' , clinicController.addTime);

// Delete time 

router.put('/delete/time/:id' , clinicController.deleteTime);


// Edit time
router.put('/edit/time/:id' , clinicController.editTime);



// Book appointment


router.put('/appointment/:id' , clinicController.bookAppointment);

// Cancel appointment

router.put('/cancel/:id' , clinicController.cancelAppointment);


module.exports = router;