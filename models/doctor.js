const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator')


const doctorSchema = mongoose.Schema({
    firstName : {type : String , required : true},
    lastName : {type : String , required : true},
    email : {type : String , required : true , unique : true},
    password : {type : String },
    phone : {type : String , required : true},
    speciality : {type : String , required : true},
    degree : {type : String , required : true},
    state : {type : String , required : true},
    image : {type : String},
    active : {type : Boolean}
});

mongoose.plugin(validator);


module.exports = mongoose.model('Doctor' , doctorSchema)