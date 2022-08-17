const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country-controller');

// // Add country

// router.post('/add' , countryController.addCountry);


// // Get countries 

// router.get('' , countryController.getCountries);
// router.get('/all' , countryController.getAll);

// // Edit country

// router.put('/:id' , countryController.editCountry);

// // Delete country

// router.delete('/:id' , countryController.deleteCountry);


router.get('' , countryController.getAll);

router.get('/:id' , countryController.getGovernorate);

router.get('/cities/:id' , countryController.getCities);

module.exports = router;