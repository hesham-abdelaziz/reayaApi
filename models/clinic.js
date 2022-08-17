const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');


const clinicSchema = mongoose.Schema({
    name : {type : String  , required : true , unique : true},
    address : {type : String  , required : true},
    phone : {type : String  , required : true},
    price : {type : String , required : true},
    images : {type : Array},
    services : {type : Array },
    times : [
        {
            day : {type : String},
            from : {type : String},
            to : {type : String}
        }
    ],
    assistants : {type : Array},
    doctorId : {type : mongoose.Schema.Types.ObjectId ,
    ref : 'Doctor' , required : true },
    ad : {type : Array},
    appointments : [
        {
            patient : {type : Array},
            appointment : [
                {
                    day : {type : Array},
                    pickedDate : {type : String }
                }
                
            ]
        }
    ]
});


mongoose.plugin(validator);

module.exports = mongoose.model('Clinic' , clinicSchema)