const express = require('express');
const router = express.Router();
const fileExtract = require('../middleware/fileExtract');
const doctorController = require('../controllers/doctor-controller')


// Get doctors

router.get('' , doctorController.getDoctors);
// Create doctor

router.post("/create" , fileExtract , doctorController.createDoctor);



// Disable doctor

router.put('/disable/:id' , doctorController.disableDoctor);

// Enable doctor
router.put('/enable/:id' , doctorController.enableDoctor);

// Get single doctor 

router.get('/:id' , doctorController.getSingleDoctor);

// Edit doctor

router.put('/edit/:id' , doctorController.editDoctor);

// change pass

router.put('/change-password/:id' , doctorController.changePassword)
// Delete doctor 


router.delete('/:id' , doctorController.deleteDoctor);

module.exports = router;