const express = require('express');
const router = express.Router();
const fileExtract = require('../middleware/fileExtract');
const specialityController = require('../controllers/speciality-controller');;



// Get specialities


router.get('' , specialityController.getSpecialities);

router.get('/all' , specialityController.getAll);
// Create speciality


router.post('/create' , fileExtract , specialityController.createSpec);

// Edit speciality 

// Get single speciality 

router.get('/:id' , specialityController.getSingleSpeciality);

router.put('/:id' ,  fileExtract ,specialityController.editSpeciality); 

// Delete speciality 


router.delete('/:id' ,  specialityController.deleteSpeciality);

module.exports = router;