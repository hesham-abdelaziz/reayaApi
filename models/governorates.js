const mongoose = require('mongoose');


const goverSchema = mongoose.Schema({
    id : {type : mongoose.Schema.Types.ObjectId},
    data : {type : Array}
})




module.exports = mongoose.model('Governorate' , goverSchema);