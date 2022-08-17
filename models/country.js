const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');


const countryScehma = mongoose.Schema({
    name : {type : String , required : true }
});


mongoose.plugin(validator);

module.exports = mongoose.model('Country' , countryScehma);