const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
    firstName : {type : String , required : true},
    lastName : {type : String , required : true},
    email : {type : String , required : true , unique : true},
    password : {type : String},
    role : {type : String},
    phone : {type : String },
    speciality : {type : String },
    degree : {type : String },
    governorate : {type : String},
    city : {type : String},
    image : {type : String},
    active : {type : Boolean},
    accountStatus : {type :String},
    accountType : {type : String},
    address : {type : String},
    about : {type : String},
    gender : {type : String},
    regNumber : {type : String},
    taxID : {type : String},
    experiences : {type : Array},
    appointments : [
        {
            appointment : {type : Array , unique : true}
        }
    ]
});


mongoose.plugin(validator);


module.exports = mongoose.model('User' , userSchema);