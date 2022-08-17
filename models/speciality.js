const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');


const specSchema = mongoose.Schema({
    name : {type : String , required : true , unique : true},
    image : {type : String , required : true}
});


mongoose.plugin(validator);

module.exports = mongoose.model('Speciality' , specSchema);