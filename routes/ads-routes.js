const express = require('express');
const router = express.Router();

const adsController = require('../controllers/ads-controller');

// Get ads

router.get('' , adsController.getAds);

// Add new 

router.post('/new' , adsController.addNew);

// Filter ads

router.get('/filter/:degree?/:speciality?/:gender?/:price?' , adsController.filterAds)

// Delete ad

router.delete('/:id' , adsController.deleteAd);

module.exports = router;